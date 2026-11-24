"use client";
import { useEffect, useState } from "react";
import { Mail, Wallet } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useT } from "@/components/i18n";
import { LanguagePicker } from "@/components/settings";
import { InstallLink } from "@/components/install";
import { startDemo } from "../actions";

type Enabled = { google: boolean; apple: boolean; line: boolean; whatsapp: boolean };

type NativePlugins = {
  Browser?: { open(o: { url: string }): Promise<void>; close(): Promise<void> };
  App?: { addListener(e: "appUrlOpen", cb: (d: { url: string }) => void): Promise<{ remove(): void }> };
};
/** The iOS app (Capacitor) exposes its native plugins on window. */
function native() {
  const cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean; Plugins?: NativePlugins } }).Capacitor;
  return cap?.isNativePlatform?.() ? (cap.Plugins ?? {}) : null;
}
type Mode = "menu" | "whatsapp" | "email";

function toE164(raw: string) {
  const s = raw.replace(/[^\d+]/g, "");
  if (s.startsWith("+")) return s;
  if (s.startsWith("00")) return `+${s.slice(2)}`;
  if (s.startsWith("0")) return `+886${s.slice(1)}`; // local Taiwan number
  return `+${s}`;
}

export function SignIn({ next, enabled }: { next: string; enabled: Enabled }) {
  const t = useT();
  const [mode, setMode] = useState<Mode>("menu");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function run(fn: () => Promise<{ error?: { message?: string } | null } | void>) {
    setErr("");
    setBusy(true);
    try {
      const r = await fn();
      if (r && r.error) setErr(r.error.message || t("somethingWrong"));
    } catch {
      setErr(t("somethingWrong"));
    } finally {
      setBusy(false);
    }
  }

  // Apple sign-in is offered on iPhone, iPad and Mac
  const [appleDevice, setAppleDevice] = useState(false);
  useEffect(() => {
    setAppleDevice(/iPhone|iPad|Macintosh/.test(navigator.userAgent) || !!native());
    // Back from Safari with a one-time code: trade it for the session inside the app
    const n = native();
    const sub = n?.App?.addListener("appUrlOpen", ({ url }) => {
      const code = new URL(url).searchParams.get("code");
      if (!url.startsWith("carecash://auth") || !code) return;
      void n.Browser?.close().catch(() => {});
      const to = new URL(url).searchParams.get("next") ?? "/home";
      window.location.href = `/api/native/redeem?code=${encodeURIComponent(code)}&next=${encodeURIComponent(to)}`;
    });
    return () => void sub?.then((h) => h.remove());
  }, []);

  const social = (provider: "google" | "apple" | "line") => {
    const n = native();
    // Google refuses sign-in inside app web views, so the iOS app does it in Safari and comes back
    if (n?.Browser && provider === "google")
      return run(() => n.Browser!.open({ url: `${window.location.origin}/native-login?provider=google&next=${encodeURIComponent(next)}` }));
    return run(() => authClient.signIn.social({ provider, callbackURL: next }));
  };

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-5 pb-10 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <div className="flex justify-end">
        <LanguagePicker compact />
      </div>
      <div className="mb-8 mt-8 text-center">
        <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-[28px] bg-accent text-white" style={{ boxShadow: "0 14px 30px -12px color-mix(in srgb, var(--accent) 70%, transparent)" }}><Wallet size={46} strokeWidth={2} /></div>
        <h1 className="text-4xl font-extrabold tracking-tight">{t("appName")}</h1>
        <p className="mt-2 text-xl text-muted">{t("tagline")}</p>
      </div>

      {mode === "menu" && (
        <div className="space-y-3">
          {enabled.whatsapp && (
            <button className="btn text-white" style={{ background: "#128C4B" }} onClick={() => setMode("whatsapp")}>
              <WhatsAppIcon /> {t("continueWith", { p: "WhatsApp" })}
            </button>
          )}
          {enabled.google && (
            <button className="btn-soft" disabled={busy} onClick={() => social("google")}>
              <GoogleIcon /> {t("continueWith", { p: "Google" })}
            </button>
          )}
          {enabled.line && (
            <button className="btn text-white" style={{ background: "#06C755" }} disabled={busy} onClick={() => social("line")}>
              <span className="rounded-md bg-white px-1.5 text-sm font-black text-[#06C755]">LINE</span> {t("continueWith", { p: "LINE" })}
            </button>
          )}
          {enabled.apple && appleDevice && (
            <button className="btn bg-black text-white" disabled={busy} onClick={() => social("apple")}>
              <span className="text-2xl"></span> {t("continueWith", { p: "Apple" })}
            </button>
          )}
          <button className="btn-soft" onClick={() => setMode("email")}>
            <Mail size={22} /> {t("continueWith", { p: t("email") })}
          </button>
          <div className="pt-6">
            <div className="flex flex-wrap gap-2">
              {(["admin", "caretaker"] as const).map((role) => (
                <button
                  key={role}
                  className="chip min-h-14 flex-[1_1_auto] whitespace-nowrap px-3 text-[15px]"
                  disabled={busy}
                  onClick={() =>
                    run(async () => {
                      const r = await authClient.signIn.anonymous();
                      if (r.error) return r;
                      await startDemo(role);
                    })
                  }
                >
                  {t("tryAs", { role: role === "admin" ? t("roleAdmin") : t("roleCaretaker") })}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {mode === "whatsapp" && <WhatsAppForm next={next} run={run} busy={busy} back={() => setMode("menu")} />}
      {mode === "email" && <EmailForm next={next} run={run} busy={busy} back={() => setMode("menu")} />}

      {err && <p className="mt-4 rounded-2xl bg-bad-soft p-4 text-lg font-semibold text-bad">{err}</p>}
      <div className="mt-auto flex justify-center pt-10">
        <InstallLink />
      </div>
    </main>
  );
}

type FormProps = {
  next: string;
  busy: boolean;
  back: () => void;
  run: (fn: () => Promise<{ error?: { message?: string } | null } | void>) => Promise<void>;
};

function WhatsAppForm({ next, run, busy, back }: FormProps) {
  const t = useT();
  const [phone, setPhone] = useState("+886 ");
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState("");
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const p = toE164(phone);
        if (!sent)
          run(async () => {
            const r = await authClient.phoneNumber.sendOtp({ phoneNumber: p });
            if (!r.error) setSent(true);
            return r;
          });
        else
          run(async () => {
            const r = await authClient.phoneNumber.verify({ phoneNumber: p, code });
            if (!r.error) window.location.href = next;
            return r;
          });
      }}
    >
      <div>
        <label className="label">{t("phone")}</label>
        <input className="field" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={sent} />
      </div>
      {sent && (
        <div>
          <p className="mb-3 rounded-2xl bg-good-soft p-4 font-semibold">{t("codeSent")}</p>
          <label className="label">{t("code")}</label>
          <input className="field text-center text-3xl tracking-[0.4em]" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} autoFocus />
        </div>
      )}
      <button className="btn-primary" disabled={busy}>
        {busy ? "…" : sent ? t("verify") : t("sendCode")}
      </button>
      <button type="button" className="btn-soft" onClick={back}>
        {t("back")}
      </button>
    </form>
  );
}

function EmailForm({ next, run, busy, back }: FormProps) {
  const t = useT();
  const [signUp, setSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        run(async () => {
          const r = signUp
            ? await authClient.signUp.email({ name: name || email.split("@")[0], email, password })
            : await authClient.signIn.email({ email, password });
          if (!r.error) window.location.href = next;
          return r;
        });
      }}
    >
      {signUp && (
        <div>
          <label className="label">{t("yourName")}</label>
          <input className="field" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
      )}
      <div>
        <label className="label">{t("email")}</label>
        <input className="field" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label className="label">{t("password")}</label>
        <input className="field" type="password" autoComplete={signUp ? "new-password" : "current-password"} minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button className="btn-primary" disabled={busy}>
        {busy ? "…" : signUp ? t("signUp") : t("signIn")}
      </button>
      <button type="button" className="w-full py-3 text-lg font-semibold text-accent" onClick={() => setSignUp(!signUp)}>
        {signUp ? t("haveAccount") : t("noAccount")}
      </button>
      <button type="button" className="btn-soft" onClick={back}>
        {t("back")}
      </button>
    </form>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.2.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.4.8 3.2.6a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3Z" />
    </svg>
  );
}
function GoogleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3A12 12 0 1 1 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.3-.4-3.5Z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8A12 12 0 0 1 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7Z" />
      <path fill="#4CAF50" d="M24 44a20 20 0 0 0 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.5 5A20 20 0 0 0 24 44Z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.2-.1-2.3-.4-3.5Z" />
    </svg>
  );
}

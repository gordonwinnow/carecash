"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { Copy, Plus } from "lucide-react";
import { createInvite } from "../../actions";
import { useT } from "@/components/i18n";
import { translate, type Lang } from "@/lib/i18n";

/** Languages a caregiver is likely to read; the invite message and the page she opens use the one picked here. */
const CARETAKER_LANGS: { code: Lang; label: string }[] = [
  { code: "id", label: "Bahasa Indonesia" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "tl", label: "Tagalog" },
  { code: "th", label: "ภาษาไทย" },
  { code: "en", label: "English" },
  { code: "zh-TW", label: "中文" },
];

/** With `auto`, a link for that role is made as soon as the page opens (from the home screen's invite buttons). */
export function InvitePanel({ auto }: { auto?: "admin" | "caretaker" }) {
  const t = useT();
  const [link, setLink] = useState<{ url: string; role: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, start] = useTransition();
  const [ctLang, setCtLang] = useState<Lang>("id");

  const make = (role: "admin" | "caretaker") =>
    start(async () => {
      const code = await createInvite(role);
      setLink({ url: `${window.location.origin}/join/${code}`, role });
      setCopied(false);
    });

  const started = useRef(false);
  useEffect(() => {
    if (auto && !started.current) {
      started.current = true;
      make(auto);
      document.getElementById("invite")?.scrollIntoView({ block: "center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto]);

  // A caregiver gets the message in her language, and the link opens the app in it (?lang=, see src/proxy.ts)
  const url = link ? (link.role === "caretaker" ? `${link.url}?lang=${encodeURIComponent(ctLang)}` : link.url) : "";
  const msg = link ? (link.role === "caretaker" ? `${translate(ctLang, "inviteCaretakerMessage")} ${url}` : `${t("inviteMessage")} ${url}`) : "";

  return (
    <div id="invite" className="space-y-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button type="button" className="btn-primary" disabled={pending} onClick={() => make("caretaker")}>
          <Plus size={22} /> {t("inviteCaretaker")}
        </button>
        <button type="button" className="btn-tint" disabled={pending} onClick={() => make("admin")}>
          <Plus size={22} /> {t("inviteAdmin")}
        </button>
      </div>
      {link && (
        <div className="space-y-3 rounded-3xl bg-accent-soft p-4">
          <p className="text-base font-semibold">
            {link.role === "caretaker" ? t("roleCaretaker") : t("roleAdmin")} · {t("inviteHint")}
          </p>
          {link.role === "caretaker" && (
            <div>
              <p className="mb-2 text-sm font-semibold">{t("inviteLangLabel")}</p>
              <div className="flex flex-wrap gap-2">
                {CARETAKER_LANGS.map((l) => (
                  <button key={l.code} type="button" className="chip min-h-10 px-3 text-sm" aria-pressed={ctLang === l.code} onClick={() => setCtLang(l.code)}>
                    {l.label}
                  </button>
                ))}
              </div>
              <p className="mt-3 rounded-xl bg-card p-3 text-[15px] leading-6 [overflow-wrap:anywhere]">{msg}</p>
            </div>
          )}
          {link.role !== "caretaker" && <p className="break-all rounded-xl bg-card p-3 font-mono text-base">{url}</p>}
          <a className="btn text-white" style={{ background: "#128C4B" }} href={`https://wa.me/?text=${encodeURIComponent(msg)}`} target="_blank" rel="noreferrer">
            {t("sendWhatsApp")}
          </a>
          <a className="btn text-white" style={{ background: "#06C755" }} href={`https://line.me/R/share?text=${encodeURIComponent(msg)}`} target="_blank" rel="noreferrer">
            {t("sendLine")}
          </a>
          <button
            type="button"
            className="btn-soft"
            onClick={async () => {
              try {
                if (navigator.share) await navigator.share({ text: msg });
                else {
                  await navigator.clipboard.writeText(msg);
                  setCopied(true);
                }
              } catch {
                /* user closed the share sheet */
              }
            }}
          >
            {copied ? t("copied") : <><Copy size={20} /> {t("copyLink")}</>}
          </button>
        </div>
      )}
    </div>
  );
}

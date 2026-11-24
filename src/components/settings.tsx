"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, Eye, LogOut, Moon, Sun, SunMoon } from "lucide-react";
import { ACCENTS, LANGS, THEMES, type Lang } from "@/lib/i18n";
import { authClient } from "@/lib/auth-client";
import { useLang, useT } from "./i18n";

function setCookie(k: string, v: string) {
  document.cookie = `${k}=${encodeURIComponent(v)}; path=/; max-age=31536000; samesite=lax`;
}

const SWATCH: Record<string, string> = {
  green: "#1f9461",
  blue: "#2f6fdb",
  purple: "#7c4ddb",
  orange: "#e0662b",
  pink: "#d6457f",
  teal: "#11898a",
};

export function LanguagePicker({ compact }: { compact?: boolean }) {
  const lang = useLang();
  const router = useRouter();
  const choose = (l: Lang) => {
    setCookie("lang", l);
    document.documentElement.lang = l;
    router.refresh();
  };
  if (compact)
    return (
      <select
        value={lang}
        onChange={(e) => choose(e.target.value as Lang)}
        className="rounded-full bg-card px-4 py-2 text-base font-semibold [box-shadow:var(--shadow)]"
        aria-label="Language"
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    );
  return (
    <div className="grid grid-cols-2 gap-2">
      {LANGS.map((l) => (
        <button key={l.code} type="button" className="chip" aria-pressed={lang === l.code} onClick={() => choose(l.code)}>
          {l.label}
        </button>
      ))}
    </div>
  );
}

export function ColorPicker() {
  const t = useT();
  const [theme, setTheme] = useState("system");
  const [accent, setAccent] = useState("green");
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme || "system");
    setAccent(document.documentElement.dataset.accent || "green");
  }, []);
  const label = { system: t("themeSystem"), light: t("themeLight"), dark: t("themeDark") } as Record<string, string>;
  const icon = { system: <SunMoon size={24} />, light: <Sun size={24} />, dark: <Moon size={24} /> } as Record<string, React.ReactNode>;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {THEMES.map((th) => (
          <button
            key={th}
            type="button"
            className="chip min-h-18 flex-col !gap-1 py-2.5 text-base"
            aria-pressed={theme === th}
            onClick={() => {
              setTheme(th);
              setCookie("theme", th);
              document.documentElement.dataset.theme = th;
            }}
          >
            {icon[th]}
            {label[th]}
          </button>
        ))}
      </div>
      <div>
        <div className="label">{t("mainColor")}</div>
        <div className="flex flex-wrap gap-3">
          {ACCENTS.map((a) => (
            <button
              key={a}
              type="button"
              aria-label={a}
              aria-pressed={accent === a}
              onClick={() => {
                setAccent(a);
                setCookie("accent", a);
                document.documentElement.dataset.accent = a;
              }}
              className="flex h-14 w-14 items-center justify-center rounded-full text-white transition active:scale-95"
              style={{ background: SWATCH[a], boxShadow: accent === a ? `0 0 0 3px var(--card), 0 0 0 5px ${SWATCH[a]}` : "none" }}
            >
              {accent === a && <Check size={26} strokeWidth={3} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DemoBanner() {
  const t = useT();
  return (
    <div className="sticky top-0 z-30 flex items-center gap-3 bg-warn-soft px-4 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))] text-base font-semibold">
      <span className="flex flex-1 items-center gap-2"><Eye size={18} className="shrink-0" /> {t("demoBanner")}</span>
      <button
        type="button"
        className="shrink-0 rounded-full bg-card px-4 py-2 font-bold"
        onClick={async () => {
          await authClient.signOut();
          window.location.href = "/sign-in";
        }}
      >
        {t("leaveDemo")}
      </button>
    </div>
  );
}

export function SignOutButton() {
  const t = useT();
  return (
    <button
      type="button"
      className="btn bg-bad-soft text-bad"
      onClick={async () => {
        await authClient.signOut();
        window.location.href = "/sign-in";
      }}
    >
      <LogOut size={22} /> {t("signOut")}
    </button>
  );
}

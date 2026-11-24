"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ACCENTS, LANGS, THEMES, type Lang } from "@/lib/i18n";
import { authClient } from "@/lib/auth-client";
import { useLang, useT } from "./i18n";

function setCookie(k: string, v: string) {
  document.cookie = `${k}=${encodeURIComponent(v)}; path=/; max-age=31536000; samesite=lax`;
}

const SWATCH: Record<string, string> = {
  green: "#15803d",
  blue: "#1d4ed8",
  purple: "#7e22ce",
  orange: "#c2410c",
  pink: "#be185d",
  teal: "#0f766e",
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
        className="rounded-xl border-2 border-line bg-card px-3 py-2 text-base font-semibold"
        aria-label="Language"
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code}>
            🌐 {l.label}
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
  const icon = { system: "🌗", light: "☀️", dark: "🌙" } as Record<string, string>;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {THEMES.map((th) => (
          <button
            key={th}
            type="button"
            className="chip flex-col !gap-0 py-2"
            aria-pressed={theme === th}
            onClick={() => {
              setTheme(th);
              setCookie("theme", th);
              document.documentElement.dataset.theme = th;
            }}
          >
            <span className="text-2xl">{icon[th]}</span>
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
              className="h-14 w-14 rounded-full border-4 transition"
              style={{ background: SWATCH[a], borderColor: accent === a ? "var(--ink)" : "transparent" }}
            >
              {accent === a && <span className="text-2xl text-white">✓</span>}
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
      <span className="flex-1">👀 {t("demoBanner")}</span>
      <button
        type="button"
        className="shrink-0 rounded-xl bg-card px-3 py-2 font-bold"
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
      className="btn-soft text-bad"
      onClick={async () => {
        await authClient.signOut();
        window.location.href = "/sign-in";
      }}
    >
      {t("signOut")}
    </button>
  );
}

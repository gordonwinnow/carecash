"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLabs } from "@/app/actions";
import { useT } from "./i18n";

/** Settings → Labs: one switch for the whole family (employers only). */
export function LabsSwitch({ initial }: { initial: boolean }) {
  const t = useT();
  const router = useRouter();
  const [on, setOn] = useState(initial);
  const [pending, start] = useTransition();
  return (
    <div className="flex items-start gap-4">
      <p className="flex-1 text-base text-muted">{t("labsHint")}</p>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={t("labsSwitch")}
        disabled={pending}
        onClick={() => {
          const next = !on;
          setOn(next);
          start(async () => {
            await setLabs(next);
            router.refresh();
          });
        }}
        className={`relative mt-1 h-8 w-14 shrink-0 rounded-full transition ${on ? "bg-accent" : "bg-sunk [box-shadow:inset_0_0_0_1px_var(--line)]"}`}
      >
        <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${on ? "left-7" : "left-1"}`} />
      </button>
    </div>
  );
}

/** Small "Labs" tag next to experimental features. */
export function LabsTag() {
  return <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-extrabold uppercase tracking-wide text-accent-ink">Labs</span>;
}

export function PrintButton({ children }: { children: React.ReactNode }) {
  return (
    <button type="button" className="btn-tint" onClick={() => window.print()}>
      {children}
    </button>
  );
}

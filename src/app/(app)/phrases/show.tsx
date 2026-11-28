"use client";

import { useEffect, useState } from "react";

type Line = { key: string; big: string; small: string };

/**
 * A list of sentences; tapping one fills the screen with it in large type, so the phone can simply be turned around.
 * `bigLang` is the language of the large text (her language, or Chinese for the employer).
 */
export function PhraseList({ lines, bigLang, close }: { lines: Line[]; bigLang: string; close: string }) {
  const [open, setOpen] = useState<Line | null>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <ul className="space-y-3">
        {lines.map((l) => (
          <li key={l.key}>
            <button type="button" onClick={() => setOpen(l)} className="card block w-full text-left hover:[box-shadow:var(--shadow)]">
              <p lang={bigLang} className="text-lg font-bold leading-snug">{l.big}</p>
              <p className="mt-1.5 text-base text-muted">{l.small}</p>
            </button>
          </li>
        ))}
      </ul>
      {open && (
        <button
          type="button"
          onClick={() => setOpen(null)}
          aria-label={close}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-bg px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(2rem,env(safe-area-inset-top))] text-center"
        >
          <p lang={bigLang} className="text-[clamp(30px,8.5vw,52px)] font-extrabold leading-tight text-balance">{open.big}</p>
          <p className="text-lg text-muted">{open.small}</p>
          <span className="mt-4 text-sm font-semibold text-muted">{close}</span>
        </button>
      )}
    </>
  );
}

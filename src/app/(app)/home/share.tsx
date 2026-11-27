"use client";
import { useState } from "react";
import { Share2 } from "lucide-react";

/** Sends this month's summary to siblings: the share sheet where there is one (phones), else it is copied. */
export function ShareSummary({ text, url, label, copied }: { text: string; url: string; label: string; copied: string }) {
  const [done, setDone] = useState(false);
  const msg = `${text} ${url}`;
  return (
    <button
      type="button"
      className="btn-soft min-h-13 text-lg"
      onClick={async () => {
        try {
          if (navigator.share) return await navigator.share({ text: msg });
          await navigator.clipboard.writeText(msg);
          setDone(true);
        } catch {
          /* closed the share sheet, or the clipboard is blocked */
        }
      }}
    >
      <Share2 size={20} /> {done ? copied : label}
    </button>
  );
}

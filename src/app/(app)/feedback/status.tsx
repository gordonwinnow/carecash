import type { T } from "@/lib/i18n";

const TONE: Record<string, string> = {
  new: "bg-sunk text-muted",
  planned: "bg-accent-soft text-accent-ink",
  doing: "bg-warn-soft text-warn",
  done: "bg-good-soft text-good",
  declined: "bg-sunk text-muted",
};

export function StatusPill({ status, t }: { status: string; t: T }) {
  return <span className={`rounded-full px-3 py-1 text-sm font-bold ${TONE[status] ?? TONE.new}`}>{t(`fb_${status}` as never)}</span>;
}

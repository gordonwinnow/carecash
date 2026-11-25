import Link from "next/link";
import { ChevronRight } from "lucide-react";

/** A tappable settings row: icon, title, current value on the right. */
export function BorderlessRow({ href, icon, title, value }: { href: string; icon: React.ReactNode; title: string; value?: string }) {
  return (
    <Link href={href} className="flex min-h-14 items-center gap-3 rounded-2xl px-3 py-2 active:bg-sunk">
      <span className="badge h-9 w-9 rounded-xl">{icon}</span>
      <span className="flex-1 text-lg font-bold">{title}</span>
      {value && <span className="tabular truncate text-base font-semibold text-muted">{value}</span>}
      <ChevronRight size={20} className="shrink-0 text-muted" />
    </Link>
  );
}

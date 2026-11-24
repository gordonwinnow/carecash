import Link from "next/link";
import { Clock, Pencil } from "lucide-react";
import { Badge } from "./icons";

/**
 * One list row: icon (or receipt photo), a short title, the date, and the amount right-aligned.
 * `pending` marks money the other person has not confirmed yet: a small clock on the icon and a grey amount.
 */
export function EntryRow({
  href,
  icon,
  photo,
  title,
  sub,
  amount,
  income,
  pending,
  edited,
}: {
  href?: string;
  icon: string;
  photo?: string | null;
  title: React.ReactNode;
  sub?: React.ReactNode;
  amount: string;
  income?: boolean;
  pending?: boolean;
  /** Name of whoever last edited this entry, if anyone did */
  edited?: string | null;
}) {
  const body = (
    <>
      <span className="relative shrink-0">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`/api/photo/${photo}`} alt="" loading="lazy" className="h-11 w-11 rounded-[14px] bg-sunk object-cover" />
        ) : (
          <Badge id={icon} size={44} />
        )}
        {pending && (
          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-warn text-white ring-2 ring-card">
            <Clock size={12} strokeWidth={3} />
          </span>
        )}
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[17px] font-semibold leading-snug">{title}</div>
        {(sub || edited) && (
          <div className="flex items-center gap-1 truncate text-sm text-muted">
            {sub}
            {edited && (
              <span className="inline-flex shrink-0 items-center gap-0.5">
                {sub ? " · " : ""}
                <Pencil size={12} /> {edited}
              </span>
            )}
          </div>
        )}
      </div>
      <div className={`tabular ml-2 shrink-0 text-right text-[17px] font-bold ${pending ? "text-muted" : income ? "text-good" : ""}`}>
        {/* Money in: green with +. Spending: − in the normal text color */}
        {income ? "+" : "−"}
        {amount}
      </div>
    </>
  );
  const cls = "flex items-center gap-3 rounded-2xl px-3 py-2.5";
  return href ? (
    <Link href={href} className={`${cls} transition active:bg-sunk`}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

export function RowList({ children }: { children: React.ReactNode }) {
  return <div className="card !p-1.5">{children}</div>;
}

export function SectionHead({ title, right }: { title: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="mb-2 flex items-baseline justify-between gap-3 px-1">
      <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      {right}
    </div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="card text-center text-lg text-muted">{children}</p>;
}

import { Check, Eye, EyeOff, Pencil, Plus, Trash2, UserMinus, UserPlus, type LucideIcon } from "lucide-react";
import { diff, snapshot, type AuditRow } from "@/lib/audit";
import { day, money, when } from "@/lib/format";
import type { T } from "@/lib/i18n";

const ACTION_ICON: Record<string, LucideIcon> = {
  create: Plus,
  update: Pencil,
  delete: Trash2,
  ack: Check,
  confirm: Check,
  share: Eye,
  unshare: EyeOff,
  join: UserPlus,
  remove: UserMinus,
};
const ACTION_TONE: Record<string, string> = { create: "cash", delete: "medicine", ack: "cash", confirm: "cash", update: "accent" };

// Which existing label names each stored field
const FIELD_KEY: Record<string, string> = {
  amount: "amount",
  note: "note",
  category: "category",
  kind: "category",
  photo: "photo",
  date: "date",
  shared: "shareWithCaretaker",
  caretaker_id: "forWho",
  payer: "paidBy",
  name: "yourName",
};

function show(field: string, v: unknown, t: T, currency: string, names: Record<string, string>) {
  if (v === null || v === undefined || v === "") return "—";
  if (field === "amount") return money(Number(v), currency);
  if (field === "category") return t(`cat_${v}` as never);
  if (field === "kind") return t(`kind_${v}` as never);
  if (field === "shared") return v ? t("sharedBadge") : t("privateBadge");
  if (field === "caretaker_id" || field === "payer") return names[String(v)] ?? "—";
  return String(v);
}

/**
 * A timeline of changes. With `withEntity`, each line also says what kind of entry it was
 * (for the family-wide activity page).
 */
export function ChangeList({
  rows,
  t,
  lang,
  currency,
  names = {},
  withEntity,
}: {
  rows: AuditRow[];
  t: T;
  lang: string;
  currency: string;
  names?: Record<string, string>;
  withEntity?: boolean;
}) {
  return (
    <ol className="space-y-1">
      {rows.map((r) => {
        const Icon = ACTION_ICON[r.action] ?? Pencil;
        const changes = diff(r);
        const snap = snapshot(r);
        const summary =
          withEntity && r.action !== "update" && typeof snap.amount === "number" ? money(snap.amount as number, currency) : (snap.name as string | undefined);
        return (
          <li key={r.id} className="flex gap-3 rounded-2xl px-2 py-2.5">
            <span className={`badge tone-${ACTION_TONE[r.action] ?? "other"} h-9 w-9 rounded-full`}>
              <Icon size={17} strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold leading-snug">
                {t(`act_${r.action}` as never)}
                {withEntity && <> · {t(`ent_${r.entity}` as never)}</>}
                {summary && <span className="tabular font-normal text-muted"> · {summary}</span>}
              </p>
              {changes.map((c) =>
                c.field === "photo" ? (
                  <p key={c.field} className="text-[15px] leading-snug text-muted">
                    {t("photo")}: {t("act_update")}
                  </p>
                ) : (
                <p key={c.field} className="tabular text-[15px] leading-snug">
                  <span className="text-muted">{t((FIELD_KEY[c.field] ?? c.field) as never)}: </span>
                  <span className="text-muted line-through decoration-1">{show(c.field, c.from, t, currency, names)}</span>
                  {" → "}
                  <span className="font-semibold">{show(c.field, c.to, t, currency, names)}</span>
                </p>
                ),
              )}
              <p className="text-[13px] text-muted">
                {r.actor ?? "—"} · {when(r.at, lang)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** "Added by Siti · Nov 17 · Edited by Gordon · today", from an entry's change history (newest first). */
export function ByLine({ rows, t, lang }: { rows: AuditRow[]; t: T; lang: string }) {
  const created = [...rows].reverse().find((r) => r.action === "create");
  const edited = rows.find((r) => r.action === "update");
  const parts = [
    created && `${t("addedBy", { name: created.actor ?? "—" })} · ${day(created.at, lang)}`,
    edited && `${t("editedBy", { name: edited.actor ?? "—" })} · ${day(edited.at, lang)}`,
  ].filter(Boolean);
  if (parts.length === 0) return null;
  return <p className="-mt-3 px-1 text-[15px] text-muted">{parts.join("  ·  ")}</p>;
}

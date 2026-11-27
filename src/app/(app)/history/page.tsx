import Link from "next/link";
import { History as HistoryIcon } from "lucide-react";
import { db } from "@/lib/db";
import { getLang, getT, requireCtx } from "@/lib/ctx";
import { day, money, monthKey, monthLabel } from "@/lib/format";
import { PageTitle } from "@/components/ui";
import { EntryRow, RowList, Empty } from "@/components/rows";

type Row = {
  type: "cash" | "expense";
  id: string;
  amount: number;
  at: number;
  note: string | null;
  photo: string | null;
  category: string | null;
  ack_at: number | null;
  confirmed_at: number | null;
  self_added: number;
  created_by: string | null;
  who: string;
  who_id: string;
  edited_by: string | null;
  /** For cash: the employer who gave it */
  giver: string | null;
};

export default async function History({ searchParams }: { searchParams: Promise<{ who?: string }> }) {
  const { me } = await requireCtx();
  const t = await getT();
  const lang = await getLang();
  const isAdmin = me.role === "admin";
  const caretakers = isAdmin
    ? (db.prepare("select id, name from member where family_id = ? and role = 'caretaker' order by active desc, created_at").all(me.family_id) as { id: string; name: string }[])
    : [];
  const sp = await searchParams;
  const who = isAdmin ? (caretakers.find((c) => c.id === sp.who)?.id ?? null) : me.id;

  const rows = db
    .prepare(
      `select * from (
        select 'cash' as type, c.id, c.amount, c.created_at as at, c.note, null as photo, null as category, c.ack_at,
               c.confirmed_at, (c.created_by = c.caretaker_id) as self_added, c.created_by, m.name as who, m.id as who_id,
               (select em.name from audit a join member em on em.id = a.member_id where a.entity_id = c.id and a.action = 'update' order by a.at desc limit 1) as edited_by,
               g.name as giver
          from cash c join member m on m.id = c.caretaker_id left join member g on g.id = c.given_by
          where c.family_id = @fid and (@who is null or c.caretaker_id = @who)
        union all
        select 'expense', e.id, e.amount, e.spent_at, e.note, e.photo, e.category, null,
               null, 0, e.member_id, m.name, m.id,
               (select em.name from audit a join member em on em.id = a.member_id where a.entity_id = e.id and a.action = 'update' order by a.at desc limit 1),
               null
          from expense e join member m on m.id = e.member_id
          where e.family_id = @fid and (@who is null or e.member_id = @who)
      ) order by at desc limit 500`,
    )
    .all({ fid: me.family_id, who }) as Row[];

  const months = new Map<string, { label: string; spent: number; cash: number; rows: Row[] }>();
  for (const r of rows) {
    const k = monthKey(r.at);
    if (!months.has(k)) months.set(k, { label: monthLabel(r.at, lang), spent: 0, cash: 0, rows: [] });
    const m = months.get(k)!;
    m.rows.push(r);
    if (r.type === "expense") m.spent += r.amount;
    else m.cash += r.amount;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <PageTitle>{t("navHistory")}</PageTitle>
        <Link
          href="/activity"
          aria-label={t("activity")}
          className="mt-2 flex h-11 w-11 items-center justify-center rounded-full bg-card text-muted [box-shadow:var(--shadow)]"
        >
          <HistoryIcon size={20} />
        </Link>
      </div>
      {isAdmin && caretakers.length > 1 && (
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          <Link href="/history" className="chip min-h-11 shrink-0 rounded-full px-5 text-base" aria-pressed={!who}>{t("all")}</Link>
          {caretakers.map((c) => (
            <Link key={c.id} href={`/history?who=${c.id}`} className="chip min-h-11 shrink-0 rounded-full px-5 text-base" aria-pressed={who === c.id}>
              {c.name}
            </Link>
          ))}
        </div>
      )}
      {rows.length === 0 && <Empty>{t("nothingYet")}</Empty>}
      {[...months.values()].map((m) => (
        <section key={m.label}>
          <div className="mb-2 flex items-baseline justify-between px-4">
            <h2 className="text-lg font-bold tracking-tight">{m.label}</h2>
            <p className="tabular text-[15px] font-semibold">
              <span className="text-muted">−{money(m.spent, me.currency)}</span>
              {m.cash > 0 && <span className="text-good"> · +{money(m.cash, me.currency)}</span>}
            </p>
          </div>
          <RowList>
            {m.rows.map((r) => {
              const showWho = isAdmin && !who;
              const sub = `${showWho ? `${r.who} · ` : ""}${day(r.at, lang)}`;
              if (r.type === "expense") {
                const canEdit = isAdmin || r.who_id === me.id;
                return (
                  <EntryRow
                    key={r.id}
                    href={canEdit ? `/expense/${r.id}` : undefined}
                    icon={r.category ?? "other"}
                    photo={r.photo}
                    title={r.note || t(`cat_${r.category}` as never)}
                    sub={sub}
                    amount={money(r.amount, me.currency)}
                    edited={r.edited_by}
                  />
                );
              }
              const canEdit = isAdmin || (!!r.self_added && r.created_by === me.id);
              // Who gave the money, so siblings who chip in can see their part: "Mei → Siti", or just "Mei" for the caretaker herself
              const from = r.giver && r.giver !== r.who ? r.giver : null;
              const cashSub = `${from ? (showWho ? `${from} → ${r.who} · ` : `${from} · `) : showWho ? `${r.who} · ` : ""}${day(r.at, lang)}`;
              const pending = r.self_added ? !r.confirmed_at : !r.ack_at;
              return (
                <EntryRow
                  key={r.id}
                  href={canEdit ? `/cash/${r.id}` : undefined}
                  icon="cash"
                  title={<span className="inline-block first-letter:uppercase">{r.note || t("ent_cash")}</span>}
                  sub={cashSub}
                  amount={money(r.amount, me.currency)}
                  income
                  pending={pending}
                  edited={r.edited_by}
                />
              );
            })}
          </RowList>
        </section>
      ))}
    </div>
  );
}

import Link from "next/link";
import { db } from "@/lib/db";
import { getLang, getT, requireCtx } from "@/lib/ctx";
import { catIcon, money, monthKey, monthLabel, when } from "@/lib/format";
import { deleteCash, deleteExpense } from "../../actions";
import { ActionButton, PhotoThumb } from "@/components/ui";

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
  who: string;
  who_id: string;
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
               c.confirmed_at, (c.created_by = c.caretaker_id) as self_added, m.name as who, m.id as who_id
          from cash c join member m on m.id = c.caretaker_id
          where c.family_id = @fid and (@who is null or c.caretaker_id = @who)
        union all
        select 'expense', e.id, e.amount, e.spent_at, e.note, e.photo, e.category, null,
               null, 0, m.name, m.id
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
    <div className="space-y-5">
      <h1 className="text-3xl font-extrabold">🧾 {t("navHistory")}</h1>
      {isAdmin && caretakers.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Link href="/history" className="chip shrink-0" aria-pressed={!who}>{t("all")}</Link>
          {caretakers.map((c) => (
            <Link key={c.id} href={`/history?who=${c.id}`} className="chip shrink-0" aria-pressed={who === c.id}>
              {c.name}
            </Link>
          ))}
        </div>
      )}
      {rows.length === 0 && <p className="card text-center text-lg text-muted">{t("nothingYet")}</p>}
      {[...months.values()].map((m) => (
        <section key={m.label}>
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3">
            <h2 className="text-xl font-extrabold">{m.label}</h2>
            <p className="text-base text-muted">
              {t("monthSpent", { amount: money(m.spent, me.currency) })} · {t("monthCash", { amount: money(m.cash, me.currency) })}
            </p>
          </div>
          <ul className="card divide-y divide-line !p-0">
            {m.rows.map((r) => {
              const canDelete =
                r.type === "cash" ? isAdmin || (!!r.self_added && !r.confirmed_at && r.who_id === me.id) : isAdmin || r.who_id === me.id;
              const cashStatus = r.self_added
                ? r.confirmed_at
                  ? { ok: true, text: t("masterConfirmed") }
                  : { ok: false, text: `⏳ ${t("notConfirmed")}` }
                : r.ack_at
                  ? { ok: true, text: t("confirmedAt") }
                  : { ok: false, text: `⏳ ${t("waitingAck")}` };
              return (
                <li key={r.id} className="flex items-center gap-3 p-4">
                  {r.photo ? (
                    <PhotoThumb name={r.photo} />
                  ) : (
                    <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-3xl ${r.type === "cash" ? "bg-good-soft" : "bg-bg"}`}>
                      {r.type === "cash" ? "💵" : catIcon(r.category ?? "other")}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-lg font-semibold leading-snug">
                      {r.type === "cash"
                        ? isAdmin
                          ? t("cashTo", { name: r.who })
                          : t("received")
                        : `${t(`cat_${r.category}` as never)}${isAdmin && !who ? ` · ${r.who}` : ""}`}
                    </div>
                    {r.note && <div className="text-base">{r.note}</div>}
                    <div className="text-sm text-muted">
                      {when(r.at, lang)}
                      {r.type === "cash" && (
                        <span className={`ml-2 font-semibold ${cashStatus.ok ? "text-good" : "text-warn"}`}>{cashStatus.text}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className={`text-xl font-bold ${r.type === "cash" ? "text-good" : ""}`}>
                      {r.type === "cash" ? "+" : "−"}
                      {money(r.amount, me.currency)}
                    </div>
                    {canDelete && (
                      <ActionButton
                        action={(r.type === "cash" ? deleteCash : deleteExpense).bind(null, r.id)}
                        confirm={t("confirmDelete")}
                        className="text-sm font-semibold text-muted underline"
                      >
                        {t("delete")}
                      </ActionButton>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

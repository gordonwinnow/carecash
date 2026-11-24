import Link from "next/link";
import { redirect } from "next/navigation";
import { Eye, Lock, Plus } from "lucide-react";
import { db } from "@/lib/db";
import { getLang, getT, requireCtx } from "@/lib/ctx";
import { KINDS, kindIconId, money, TZ } from "@/lib/format";
import { toggleShare } from "../../actions";
import { ActionButton, PageTitle } from "@/components/ui";
import { Badge } from "@/components/icons";
import { EntryRow, RowList, Empty } from "@/components/rows";

type Rec = {
  id: string;
  kind: string;
  amount: number;
  note: string | null;
  photo: string | null;
  date: string;
  shared: number;
  who: string | null;
  edited_by: string | null;
};

/** Phase 2: salary, healthcare and other costs. Employers see everything; caretakers only what is shared with them. */
export default async function More() {
  const { me } = await requireCtx();
  const t = await getT();
  const lang = await getLang();
  const isAdmin = me.role === "admin";

  const rows = db
    .prepare(
      `select r.*, m.name as who, (select em.name from audit a join member em on em.id = a.member_id where a.entity_id = r.id and a.action = 'update' order by a.at desc limit 1) as edited_by from record r left join member m on m.id = r.caretaker_id
       where r.family_id = @fid
         and (@admin = 1 or (r.shared = 1 and (r.caretaker_id is null or r.caretaker_id = @me)))
       order by r.date desc, r.created_at desc limit 500`,
    )
    .all({ fid: me.family_id, admin: isAdmin ? 1 : 0, me: me.id }) as Rec[];

  if (!isAdmin && rows.length === 0) redirect("/home");

  const year = new Date().toLocaleDateString("en-CA", { timeZone: TZ }).slice(0, 4);
  const totals = KINDS.map((k) => ({
    ...k,
    sum: rows.filter((r) => r.kind === k.id && r.date.startsWith(year)).reduce((a, r) => a + r.amount, 0),
  }));

  return (
    <div className="space-y-6">
      <PageTitle sub={isAdmin ? t("moreHint") : undefined}>{isAdmin ? t("more") : t("myRecords")}</PageTitle>

      <section className="card">
        <p className="mb-3 text-base font-semibold text-muted">{t("thisYear")} · {year}</p>
        <div className="grid grid-cols-3 gap-2">
          {totals.map((k) => (
            <div key={k.id} className="flex flex-col items-center gap-1.5 text-center">
              <Badge id={kindIconId(k.id)} size={44} />
              <div className="text-[13px] font-semibold leading-tight text-muted">{t(`kind_${k.id}`)}</div>
              <div className="tabular text-lg font-bold">{money(k.sum, me.currency)}</div>
            </div>
          ))}
        </div>
      </section>

      {isAdmin && (
        <Link href="/more/new" className="btn-primary">
          <Plus size={24} /> {t("addRecord")}
        </Link>
      )}

      {rows.length === 0 ? (
        <Empty>{t("nothingYet")}</Empty>
      ) : (
        <RowList>
          {rows.map((r) => (
            <div key={r.id}>
              <EntryRow
                href={isAdmin ? `/more/${r.id}` : undefined}
                icon={kindIconId(r.kind)}
                photo={r.photo}
                title={`${t(`kind_${r.kind}` as never)}${r.who ? ` · ${r.who}` : ""}`}
                sub={[r.note, new Date(`${r.date}T12:00:00Z`).toLocaleDateString(lang, { year: "numeric", month: "short", day: "numeric" })]
                  .filter(Boolean)
                  .join(" · ")}
                amount={money(r.amount, me.currency)}
                edited={isAdmin ? r.edited_by : null}
              />
              {isAdmin && (
                <div className="-mt-1 pb-2 pl-[72px]">
                  <ActionButton
                    action={toggleShare.bind(null, r.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-bold ${r.shared ? "bg-good-soft text-good" : "bg-sunk text-muted"}`}
                  >
                    {r.shared ? <Eye size={14} /> : <Lock size={14} />}
                    {r.shared ? t("sharedBadge") : t("privateBadge")}
                  </ActionButton>
                </div>
              )}
            </div>
          ))}
        </RowList>
      )}
    </div>
  );
}

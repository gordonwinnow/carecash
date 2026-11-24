import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getLang, getT, requireCtx } from "@/lib/ctx";
import { KINDS, kindIcon, money, TZ } from "@/lib/format";
import { deleteRecord, toggleShare } from "../../actions";
import { ActionButton, PhotoThumb } from "@/components/ui";

type Rec = {
  id: string;
  kind: string;
  amount: number;
  note: string | null;
  photo: string | null;
  date: string;
  shared: number;
  who: string | null;
};

/** Phase 2: salary, healthcare and other costs. Masters see everything; caretakers only what is shared with them. */
export default async function More() {
  const { me } = await requireCtx();
  const t = await getT();
  const lang = await getLang();
  const isAdmin = me.role === "admin";

  const rows = db
    .prepare(
      `select r.*, m.name as who from record r left join member m on m.id = r.caretaker_id
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
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-extrabold">🔒 {isAdmin ? t("more") : t("myRecords")}</h1>
        {isAdmin && <p className="mt-1 text-base text-muted">{t("moreHint")}</p>}
      </header>

      <section className="card">
        <p className="mb-3 text-lg font-semibold text-muted">{t("thisYear")} · {year}</p>
        <div className="grid grid-cols-3 gap-2">
          {totals.map((k) => (
            <div key={k.id} className="rounded-2xl bg-bg p-3 text-center">
              <div className="text-3xl">{k.icon}</div>
              <div className="text-sm font-semibold text-muted">{t(`kind_${k.id}`)}</div>
              <div className="text-lg font-bold">{money(k.sum, me.currency)}</div>
            </div>
          ))}
        </div>
      </section>

      {isAdmin && (
        <Link href="/more/new" className="btn-primary min-h-20 text-2xl">➕ {t("addRecord")}</Link>
      )}

      {rows.length === 0 ? (
        <p className="card text-center text-lg text-muted">{t("nothingYet")}</p>
      ) : (
        <ul className="card divide-y divide-line !p-0">
          {rows.map((r) => (
            <li key={r.id} className="flex items-start gap-3 p-4">
              {r.photo ? (
                <PhotoThumb name={r.photo} />
              ) : (
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-bg text-3xl">{kindIcon(r.kind)}</span>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-lg font-semibold">
                  {t(`kind_${r.kind}` as never)}
                  {r.who ? ` · ${r.who}` : ""}
                </div>
                {r.note && <div className="text-base">{r.note}</div>}
                <div className="text-sm text-muted">
                  {new Date(`${r.date}T12:00:00Z`).toLocaleDateString(lang, { year: "numeric", month: "short", day: "numeric" })}
                </div>
                {isAdmin && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <ActionButton
                      action={toggleShare.bind(null, r.id)}
                      className={`rounded-full px-3 py-1.5 text-sm font-bold ${r.shared ? "bg-good-soft text-good" : "bg-bg text-muted"}`}
                    >
                      {r.shared ? `👁 ${t("sharedBadge")}` : `🔒 ${t("privateBadge")}`}
                    </ActionButton>
                    <ActionButton action={deleteRecord.bind(null, r.id)} confirm={t("confirmDelete")} className="px-2 text-sm font-semibold text-muted underline">
                      {t("delete")}
                    </ActionButton>
                  </div>
                )}
              </div>
              <div className="text-xl font-bold">{money(r.amount, me.currency)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

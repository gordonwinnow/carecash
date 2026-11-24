import Link from "next/link";
import { db } from "@/lib/db";
import { balanceOf, getLang, getT, requireCtx, type Member } from "@/lib/ctx";
import { catIcon, money, when } from "@/lib/format";
import type { T } from "@/lib/i18n";
import { ackCash, confirmCash, deleteCash } from "../../actions";
import { ActionButton, PhotoThumb } from "@/components/ui";

type Cash = { id: string; amount: number; note: string | null; created_at: number; ack_at: number | null; giver: string; caretaker_id: string };
type Expense = { id: string; amount: number; category: string; note: string | null; photo: string | null; spent_at: number; who: string };

export default async function Home() {
  const { me } = await requireCtx();
  const t = await getT();
  const lang = await getLang();

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-base text-muted">{me.family_name}</p>
          <h1 className="text-2xl font-extrabold">👋 {me.name}</h1>
        </div>
        <span className="rounded-full bg-accent-soft px-4 py-2 text-base font-bold">
          {me.role === "admin" ? t("roleAdmin") : t("roleCaretaker")}
        </span>
      </header>
      {me.role === "caretaker" ? <CaretakerHome me={me} t={t} lang={lang} /> : <MasterHome me={me} t={t} lang={lang} />}
    </div>
  );
}

function CaretakerHome({ me, t, lang }: { me: Member; t: T; lang: string }) {
  const pending = db
    .prepare(
      `select c.*, m.name as giver from cash c join member m on m.id = c.given_by
       where c.caretaker_id = ? and c.ack_at is null order by c.created_at`,
    )
    .all(me.id) as Cash[];
  const b = balanceOf(me.id);
  const recent = db
    .prepare("select e.*, '' as who from expense e where member_id = ? order by spent_at desc limit 5")
    .all(me.id) as Expense[];

  return (
    <>
      {pending.map((c) => (
        <section key={c.id} className="card border-2 !border-warn bg-warn-soft">
          <p className="text-lg font-semibold">💵 {t("gaveYou", { name: c.giver })}</p>
          <p className="my-1 text-5xl font-extrabold">{money(c.amount, me.currency)}</p>
          {c.note && <p className="text-lg text-muted">{c.note}</p>}
          <p className="mb-4 text-base text-muted">{when(c.created_at, lang)}</p>
          <ActionButton action={ackCash.bind(null, c.id)} className="btn-good text-2xl">
            ✅ {t("iReceived")}
          </ActionButton>
        </section>
      ))}

      <BalanceCard title={t("moneyLeft")} b={b} t={t} currency={me.currency} />

      <Link href="/expense/new" className="btn-primary min-h-24 text-2xl">
        📷 {t("addExpense")}
      </Link>
      <Link href="/cash/new" className="btn-soft">
        💵 {t("iGotMoney")}
      </Link>

      <ExpenseList title={t("recent")} rows={recent} t={t} lang={lang} currency={me.currency} />
    </>
  );
}

function MasterHome({ me, t, lang }: { me: Member; t: T; lang: string }) {
  const caretakers = db
    .prepare("select * from member where family_id = ? and role = 'caretaker' and active = 1 order by created_at")
    .all(me.family_id) as Member[];
  const recent = db
    .prepare(
      `select e.*, m.name as who from expense e join member m on m.id = e.member_id
       where e.family_id = ? order by spent_at desc limit 6`,
    )
    .all(me.family_id) as Expense[];

  if (caretakers.length === 0)
    return (
      <section className="card space-y-4 text-center">
        <div className="text-6xl">🤝</div>
        <h2 className="text-2xl font-extrabold">{t("noCaretaker")}</h2>
        <p className="text-lg text-muted">{t("noCaretakerHint")}</p>
        <Link href="/settings#invite" className="btn-primary">➕ {t("inviteCaretaker")}</Link>
      </section>
    );

  // Money a caretaker recorded herself, waiting for a master to confirm
  const toConfirm = db
    .prepare(
      `select c.*, m.name as giver from cash c join member m on m.id = c.caretaker_id
       where c.family_id = ? and c.created_by = c.caretaker_id and c.confirmed_at is null order by c.created_at`,
    )
    .all(me.family_id) as Cash[];

  return (
    <>
      {toConfirm.map((c) => (
        <section key={c.id} className="card border-2 !border-warn bg-warn-soft">
          <p className="text-lg font-semibold">💵 {t("selfAdded", { name: c.giver })}</p>
          <p className="my-1 text-5xl font-extrabold">{money(c.amount, me.currency)}</p>
          {c.note && <p className="text-lg text-muted">{c.note}</p>}
          <p className="mb-4 text-base text-muted">{when(c.created_at, lang)}</p>
          <ActionButton action={confirmCash.bind(null, c.id)} className="btn-good text-2xl">
            ✅ {t("confirmGave")}
          </ActionButton>
          <ActionButton action={deleteCash.bind(null, c.id)} confirm={t("confirmDelete")} className="mt-2 w-full py-2 text-base font-semibold text-muted underline">
            {t("delete")}
          </ActionButton>
        </section>
      ))}
      {caretakers.map((c) => {
        const b = balanceOf(c.id);
        return (
          <section key={c.id} className="space-y-3">
            <BalanceCard title={t("moneyLeftOf", { name: c.name })} b={b} t={t} currency={me.currency} />
            <div className="grid grid-cols-2 gap-3">
              <Link href={`/cash/new?to=${c.id}`} className="btn-primary">💵 {t("giveCash")}</Link>
              <Link href={`/history?who=${c.id}`} className="btn-soft">🧾 {t("navHistory")}</Link>
            </div>
          </section>
        );
      })}
      <ExpenseList title={t("recent")} rows={recent} t={t} lang={lang} currency={me.currency} showWho />
    </>
  );
}

function BalanceCard({ title, b, t, currency }: { title: string; b: ReturnType<typeof balanceOf>; t: T; currency: string }) {
  const low = b.left < 0;
  return (
    <section className="card text-center">
      <p className="text-xl font-semibold text-muted">{title}</p>
      <p className={`my-2 text-6xl font-extrabold tracking-tight ${low ? "text-bad" : "text-ink"}`}>{money(b.left, currency)}</p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-lg">
        <div className="rounded-2xl bg-bg p-2.5">
          <div className="text-sm font-semibold leading-tight text-muted">{t("carry")}</div>
          <div className="font-bold">{money(b.carry, currency)}</div>
        </div>
        <div className="rounded-2xl bg-good-soft p-2.5">
          <div className="text-sm font-semibold leading-tight text-muted">+ {t("thisMonthReceived")}</div>
          <div className="font-bold">{money(b.received, currency)}</div>
        </div>
        <div className="rounded-2xl bg-bad-soft p-2.5">
          <div className="text-sm font-semibold leading-tight text-muted">− {t("thisMonthSpent")}</div>
          <div className="font-bold">{money(b.spent, currency)}</div>
        </div>
      </div>
      {b.pending > 0 && (
        <p className="mt-3 rounded-2xl bg-warn-soft p-3 text-lg font-semibold">⏳ {t("waiting", { amount: money(b.pending, currency) })}</p>
      )}
    </section>
  );
}

function ExpenseList({ title, rows, t, lang, currency, showWho }: { title: string; rows: Expense[]; t: T; lang: string; currency: string; showWho?: boolean }) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xl font-extrabold">{title}</h2>
        <Link href="/history" className="text-lg font-semibold text-accent">{t("seeAll")} →</Link>
      </div>
      {rows.length === 0 ? (
        <p className="card text-center text-lg text-muted">{t("nothingYet")}</p>
      ) : (
        <ul className="card divide-y divide-line !p-0">
          {rows.map((e) => (
            <li key={e.id} className="flex items-center gap-3 p-4">
              {e.photo ? <PhotoThumb name={e.photo} /> : <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-bg text-3xl">{catIcon(e.category)}</span>}
              <div className="min-w-0 flex-1">
                <div className="truncate text-lg font-semibold">
                  {t(`cat_${e.category}` as never)}
                  {e.note ? ` · ${e.note}` : ""}
                </div>
                <div className="text-base text-muted">
                  {showWho && e.who ? `${e.who} · ` : ""}
                  {when(e.spent_at, lang)}
                </div>
              </div>
              <div className="text-xl font-bold">−{money(e.amount, currency)}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

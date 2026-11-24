import Link from "next/link";
import { Banknote, Camera, Check, HandCoins, Wallet, HeartHandshake, Plus } from "lucide-react";
import { db } from "@/lib/db";
import { balanceOf, getLang, getT, requireCtx, type Member } from "@/lib/ctx";
import { day, money } from "@/lib/format";
import type { T } from "@/lib/i18n";
import { ackCash, confirmCash, deleteCash } from "../../actions";
import { ActionButton } from "@/components/ui";
import { EntryRow, RowList, SectionHead, Empty } from "@/components/rows";

type Cash = { id: string; amount: number; note: string | null; created_at: number; ack_at: number | null; giver: string; caretaker_id: string };
type Expense = { id: string; amount: number; category: string; note: string | null; photo: string | null; spent_at: number; who: string };

export default async function Home() {
  const { me } = await requireCtx();
  const t = await getT();
  const lang = await getLang();

  return (
    <div className="space-y-6">
      {/* One line: family · name · role */}
      <header className="flex items-center gap-2 pt-2">
        <h1 className="flex min-w-0 items-baseline gap-2">
          <span className="truncate text-base font-medium text-muted">{me.family_name}</span>
          <span className="truncate text-2xl font-extrabold tracking-tight">{me.name}</span>
        </h1>
        <span className="shrink-0 rounded-full bg-accent-soft px-3 py-1 text-sm font-bold text-accent-ink">
          {me.role === "admin" ? t("roleAdmin") : t("roleCaretaker")}
        </span>
      </header>
      {me.role === "caretaker" ? <CaretakerHome me={me} t={t} lang={lang} /> : <EmployerHome me={me} t={t} lang={lang} />}
    </div>
  );
}

/** A money card that needs a tap from this person: receive it, or confirm it was given. */
function PendingCard({ icon, title, amount, note, at, children }: { icon: React.ReactNode; title: string; amount: string; note: string | null; at: string; children: React.ReactNode }) {
  return (
    // Two lines, laid out like the balance card so the amounts line up
    <section className="space-y-4 rounded-[28px] bg-warn-soft px-[18px] pb-[18px] pt-5">
      <p className="flex items-center gap-2 text-base font-semibold">
        <span className="shrink-0 text-warn">{icon}</span>
        <span className="truncate">{title}</span>
        <span className="shrink-0 font-medium text-muted">· {at}</span>
      </p>
      <p className="flex items-baseline justify-between gap-3 leading-none">
        <span className="min-w-0 truncate text-lg font-semibold text-muted">{note}</span>
        <span className="tabular flex shrink-0 items-baseline gap-2">
          <span className="text-lg font-bold text-muted">NTD</span>
          <span className="text-[44px] font-extrabold tracking-tight">{amount}</span>
        </span>
      </p>
      {children}
    </section>
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
        <PendingCard key={c.id} icon={<HandCoins size={20} />} title={t("gaveYou", { name: c.giver })} amount={money(c.amount, me.currency)} note={c.note} at={day(c.created_at, lang)}>
          <ActionButton action={ackCash.bind(null, c.id)} className="btn-good">
            <Check size={26} strokeWidth={2.6} /> {t("iReceived")}
          </ActionButton>
        </PendingCard>
      ))}

      <BalanceCard b={b} t={t} />

      {/* One row: the main action wide, "got money" as a short side button */}
      <div className="grid grid-cols-[1fr_auto] gap-3">
        <Link href="/expense/new" className="btn-primary min-h-20 px-4 text-xl leading-tight">
          <Camera size={26} className="shrink-0" /> {t("addExpense")}
        </Link>
        <Link href="/cash/new" className="btn-tint min-h-20 w-auto flex-col !gap-1 px-4 text-[15px] leading-tight">
          <Banknote size={24} /> {t("gotMoneyShort")}
        </Link>
      </div>

      <ExpenseList title={t("recent")} rows={recent} t={t} lang={lang} currency={me.currency} />
    </>
  );
}

function EmployerHome({ me, t, lang }: { me: Member; t: T; lang: string }) {
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
      <section className="card space-y-4 py-8 text-center">
        <span className="badge mx-auto h-20 w-20 rounded-3xl">
          <HeartHandshake size={40} />
        </span>
        <h2 className="text-2xl font-extrabold">{t("noCaretaker")}</h2>
        <p className="text-lg text-muted">{t("noCaretakerHint")}</p>
        <Link href="/settings#invite" className="btn-primary">
          <Plus size={24} /> {t("inviteCaretaker")}
        </Link>
      </section>
    );

  // Money a caretaker recorded herself, waiting for an employer to confirm
  const toConfirm = db
    .prepare(
      `select c.*, m.name as giver from cash c join member m on m.id = c.caretaker_id
       where c.family_id = ? and c.created_by = c.caretaker_id and c.confirmed_at is null order by c.created_at`,
    )
    .all(me.family_id) as Cash[];

  return (
    <>
      {toConfirm.map((c) => (
        <PendingCard key={c.id} icon={<HandCoins size={20} />} title={t("selfAdded", { name: c.giver })} amount={money(c.amount, me.currency)} note={c.note} at={day(c.created_at, lang)}>
          <ActionButton action={confirmCash.bind(null, c.id)} className="btn-good">
            <Check size={26} strokeWidth={2.6} /> {t("confirmGave")}
          </ActionButton>
          <ActionButton action={deleteCash.bind(null, c.id, undefined)} confirm={t("confirmDelete")} className="w-full py-1 text-base font-semibold text-muted">
            {t("delete")}
          </ActionButton>
        </PendingCard>
      ))}
      {caretakers.map((c) => {
        const b = balanceOf(c.id);
        return (
          <section key={c.id} className="space-y-3">
            <BalanceCard title={c.name} b={b} t={t} />
            {/* One row: add household cash wide, other costs (salary, health…) as a short side button */}
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <Link href={`/cash/new?to=${c.id}`} className="btn-primary min-h-20 px-4 text-xl leading-tight">
                <Plus size={26} className="shrink-0" /> {t("giveCash")}
              </Link>
              <Link href={`/more/new?for=${c.id}`} className="btn-tint min-h-20 w-auto flex-col !gap-1 px-4 text-[15px] leading-tight">
                <Wallet size={24} /> {t("otherShort")}
              </Link>
            </div>
          </section>
        );
      })}
      <ExpenseList title={t("recent")} rows={recent} t={t} lang={lang} currency={me.currency} showWho />
    </>
  );
}

/** The hero number: money left now, and what was spent this month. */
function BalanceCard({ title, b, t }: { title?: string; b: ReturnType<typeof balanceOf>; t: T }) {
  const n = (v: number) => `$${v.toLocaleString("en-US")}`;
  return (
    <section
      className="relative overflow-hidden rounded-[28px] px-[18px] pb-[18px] pt-5 text-white"
      style={{
        background: "linear-gradient(145deg, color-mix(in srgb, var(--accent) 85%, white) 0%, var(--accent) 45%, color-mix(in srgb, var(--accent) 72%, black) 100%)",
        boxShadow: "0 14px 32px -14px color-mix(in srgb, var(--accent) 70%, transparent)",
      }}
    >
      {title && <p className="relative mb-2 text-lg font-bold text-white/90">{title}</p>}
      {/* "NTD $5,765 remaining" on one line; wraps only for very large amounts */}
      <p className="relative flex items-baseline justify-between gap-3 leading-none">
        <span className="text-lg font-semibold text-white/85">{t("remaining")}</span>
        <span className={`tabular flex shrink-0 items-baseline gap-2 ${b.left < 0 ? "text-[#ffd7dc]" : ""}`}>
          <span className="text-lg font-bold text-white/75">NTD</span>
          <span className="text-[44px] font-extrabold tracking-tight">{b.left < 0 ? "−" : ""}{n(Math.abs(b.left))}</span>
        </span>
      </p>
      <p className="tabular relative mt-2 text-right text-base font-semibold text-white/80">{t("spentLine", { amount: n(b.spent) })}</p>
    </section>
  );
}

function ExpenseList({ title, rows, t, lang, currency, showWho }: { title: string; rows: Expense[]; t: T; lang: string; currency: string; showWho?: boolean }) {
  return (
    <section>
      <SectionHead
        title={title}
        right={
          <Link href="/history" className="text-base font-semibold text-accent">
            {t("seeAll")}
          </Link>
        }
      />
      {rows.length === 0 ? (
        <Empty>{t("nothingYet")}</Empty>
      ) : (
        <RowList>
          {rows.map((e) => (
            <EntryRow
              key={e.id}
              href={`/expense/${e.id}`}
              icon={e.category}
              photo={e.photo}
              title={e.note || t(`cat_${e.category}` as never)}
              sub={`${showWho && e.who ? `${e.who} · ` : ""}${day(e.spent_at, lang)}`}
              amount={money(e.amount, currency)}
            />
          ))}
        </RowList>
      )}
    </section>
  );
}

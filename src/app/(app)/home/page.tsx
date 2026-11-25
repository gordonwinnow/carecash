import Link from "next/link";
import { Banknote, Barcode as BarcodeIcon, Camera, Check, HandCoins, Users, Wallet, HeartHandshake, Plus } from "lucide-react";
import { db } from "@/lib/db";
import { balanceOf, familyPotBalance, getLang, getT, requireCtx, type Member } from "@/lib/ctx";
import { day, money } from "@/lib/format";
import type { T } from "@/lib/i18n";
import { ackCash, ackRecord, confirmCash, deleteCash } from "../../actions";
import { ActionButton } from "@/components/ui";
import { Barcode } from "@/components/barcode";
import { EntryRow, RowList, SectionHead, Empty } from "@/components/rows";

type Cash = { id: string; amount: number; note: string | null; created_at: number; ack_at: number | null; giver: string; caretaker_id: string };
type Expense = { id: string; amount: number; category: string; note: string | null; photo: string | null; spent_at: number; who: string; edited_by: string | null };

export default async function Home() {
  const { me } = await requireCtx();
  const t = await getT();
  const lang = await getLang();
  const carrier = db.prepare("select carrier, carrier_photo from family where id = ?").get(me.family_id) as { carrier: string | null; carrier_photo: string | null };

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
        {/* The e-invoice barcode, one tap away at checkout */}
        {me.role === "admin" && (carrier.carrier || carrier.carrier_photo) && (
          <Link href="/carrier" className="ml-auto flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-card px-3.5 text-sm font-bold [box-shadow:var(--shadow)]">
            <BarcodeIcon size={18} /> {t("carrierShort")}
          </Link>
        )}
      </header>
      {me.role === "caretaker" ? <CaretakerHome me={me} t={t} lang={lang} carrier={carrier} /> : <EmployerHome me={me} t={t} lang={lang} />}
    </div>
  );
}

/** A money card that needs a tap from this person: receive it, or confirm it was given. */
function PendingCard({ icon, title, amount, note, at, children }: { icon: React.ReactNode; title: string; amount: string; note: string | null; at: string; children: React.ReactNode }) {
  return (
    // One row: who gave it and when on the left, the amount on the right (lined up with the list amounts)
    <section className="space-y-4 rounded-[28px] bg-warn-soft px-[18px] pb-[18px] pt-4">
      <div className="flex items-center gap-2">
        <span className="shrink-0 text-warn">{icon}</span>
        {/* Who, when and how much all in one type style; the amount sized like the list amounts */}
        <span className="min-w-0 truncate text-[17px] font-semibold">{title} · {at}</span>
        <span className="tabular ml-auto shrink-0 text-[17px] font-bold">{amount}</span>
      </div>
      {children}
    </section>
  );
}

function CaretakerHome({ me, t, lang, carrier }: { me: Member; t: T; lang: string; carrier: { carrier: string | null; carrier_photo: string | null } }) {
  const pending = db
    .prepare(
      `select c.*, m.name as giver from cash c join member m on m.id = c.given_by
       where c.caretaker_id = ? and c.ack_at is null order by c.created_at`,
    )
    .all(me.id) as Cash[];
  // Salary an employer recorded for her, waiting for her to confirm
  const salaries = db
    .prepare(
      `select r.id, r.amount, r.date, m.name as payer from record r left join member m on m.id = r.created_by
       where r.caretaker_id = ? and r.kind = 'salary' and r.ack_at is null order by r.date`,
    )
    .all(me.id) as { id: string; amount: number; date: string; payer: string | null }[];
  const b = balanceOf(me.id);
  const recent = db
    .prepare("select e.*, '' as who, (select em.name from audit a join member em on em.id = a.member_id where a.entity_id = e.id and a.action = 'update' order by a.at desc limit 1) as edited_by from expense e where member_id = ? order by spent_at desc limit 5")
    .all(me.id) as Expense[];

  return (
    <>
      {/* Summary first; things to confirm and actions below it */}
      <BalanceCard b={b} t={t} />

      {/* The e-invoice barcode, ready to scan at checkout without a tap; tapping opens it full size */}
      {(carrier.carrier || carrier.carrier_photo) && (
        <Link href="/carrier" aria-label={t("carrier")} className="block overflow-hidden rounded-3xl bg-white [box-shadow:var(--shadow)]">
          {carrier.carrier ? (
            // Full width so the bars stay wide enough to scan; the number small underneath
            <div className="px-5 pb-2.5 pt-4">
              <Barcode value={carrier.carrier} className="h-16" />
              <p className="tabular mt-1.5 text-center text-sm font-bold tracking-[0.2em] text-[#1c1b19]">{carrier.carrier}</p>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/api/photo/${carrier.carrier_photo}`} alt={t("carrier")} className="max-h-32 w-full object-contain" />
          )}
        </Link>
      )}

      {pending.map((c) => (
        <PendingCard key={c.id} icon={<HandCoins size={20} />} title={t("gaveYou", { name: c.giver })} amount={money(c.amount, me.currency)} note={c.note} at={day(c.created_at, lang)}>
          <ActionButton action={ackCash.bind(null, c.id)} className="btn-good">
            <Check size={26} strokeWidth={2.6} /> {t("iReceived")}
          </ActionButton>
        </PendingCard>
      ))}
      {salaries.map((r) => (
        <PendingCard
          key={r.id}
          icon={<Wallet size={20} />}
          title={t("salaryPaid", { name: r.payer ?? "" })}
          amount={money(r.amount, me.currency)}
          note={null}
          at={day(Date.parse(`${r.date}T12:00:00+08:00`), lang)}
        >
          <ActionButton action={ackRecord.bind(null, r.id)} className="btn-good">
            <Check size={26} strokeWidth={2.6} /> {t("iReceived")}
          </ActionButton>
        </PendingCard>
      ))}

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
      `select e.*, m.name as who, (select em.name from audit a join member em on em.id = a.member_id where a.entity_id = e.id and a.action = 'update' order by a.at desc limit 1) as edited_by from expense e join member m on m.id = e.member_id
       where e.family_id = ? order by spent_at desc limit 6`,
    )
    .all(me.family_id) as Expense[];

  // Money a caretaker recorded herself, waiting for an employer to confirm
  const toConfirm = db
    .prepare(
      `select c.*, m.name as giver from cash c join member m on m.id = c.caretaker_id
       where c.family_id = ? and c.created_by = c.caretaker_id and c.confirmed_at is null and m.role = 'caretaker' order by c.created_at`,
    )
    .all(me.family_id) as Cash[];

  // An employer can hold household cash too (the family's own cash pot). Shown when there is no caretaker, or once it is used.
  // It is shared by all employers: cash any of them put in, minus what any of them paid
  const potUsed = !!db
    .prepare(
      `select 1 from cash where caretaker_id in (select id from member where family_id = @fid and role = 'admin')
       union select 1 from expense where member_id in (select id from member where family_id = @fid and role = 'admin') limit 1`,
    )
    .get({ fid: me.family_id });
  const holders = [
    ...caretakers.map((c) => ({ id: c.id, title: c.name, caretaker: true, b: balanceOf(c.id) })),
    ...(caretakers.length === 0 || potUsed ? [{ id: me.id, title: t("myCash"), caretaker: false, b: familyPotBalance(me.family_id) }] : []),
  ];

  return (
    <>
      {holders.map((h) => (
        <section key={h.id} className="space-y-3">
          <BalanceCard title={h.title} b={h.b} t={t} />
          {/* One row: add household cash wide; expense (and, for a caretaker, other costs) as short side buttons */}
          <div className={`grid gap-2 ${h.caretaker ? "grid-cols-[1fr_auto_auto]" : "grid-cols-[1fr_auto]"}`}>
            <Link href={`/cash/new?to=${h.id}`} className="btn-primary min-h-20 px-4 text-xl leading-tight">
              <Plus size={26} className="shrink-0" /> {t("giveCash")}
            </Link>
            <Link href={`/expense/new?for=${h.id}`} className="btn-tint min-h-20 w-auto flex-col !gap-1 px-3 text-[15px] leading-tight">
              <Camera size={24} /> {t("expenseShort")}
            </Link>
            {h.caretaker && (
              <Link href={`/more/new?for=${h.id}`} className="btn-tint min-h-20 w-auto flex-col !gap-1 px-3 text-[15px] leading-tight">
                <Wallet size={24} /> {t("otherShort")}
              </Link>
            )}
          </div>
        </section>
      ))}
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
      {caretakers.length === 0 ? (
        <section className="card space-y-4 py-6 text-center">
          <span className="badge mx-auto h-16 w-16 rounded-3xl">
            <HeartHandshake size={32} />
          </span>
          <h2 className="text-xl font-extrabold">{t("noCaretaker")}</h2>
          <p className="text-base text-muted">{t("noCaretakerHint")}</p>
          <Link href="/settings?invite=caretaker#invite" className="btn-primary">
            <Plus size={24} /> {t("inviteCaretaker")}
          </Link>
          <Link href="/settings?invite=admin#invite" className="btn-tint">
            <Users size={22} /> {t("inviteAdmin")}
          </Link>
        </section>
      ) : (
        <Link href="/settings?invite=caretaker#invite" className="flex items-center justify-center gap-2 py-1 text-base font-semibold text-accent">
          <Plus size={18} /> {t("inviteAnother")}
        </Link>
      )}
      <ExpenseList title={t("recent")} rows={recent} t={t} lang={lang} currency={me.currency} showWho />
    </>
  );
}

/** The hero number: money left now, and what was spent this month. */
function BalanceCard({ title, b, t }: { title?: string; b: ReturnType<typeof balanceOf>; t: T }) {
  const n = (v: number) => `$${v.toLocaleString("en-US")}`;
  return (
    // No tile at all: the summary sits right on the page, so it can't be mistaken for the cards and buttons below.
    // Label lines up with the name above; right padding matches the cards so the amount lines up with the list amounts.
    <section className="pb-1 pl-0 pr-[18px] pt-1">
      {title && <p className="mb-2 text-lg font-bold">{title}</p>}
      {/* "NTD $5,765 remaining" on one line; wraps only for very large amounts */}
      <p className="flex items-baseline justify-between gap-3 leading-none">
        <span className="text-lg font-semibold text-muted">{t("remaining")}</span>
        <span className={`tabular flex shrink-0 items-baseline gap-2 ${b.left < 0 ? "text-bad" : ""}`}>
          <span className="text-lg font-bold text-muted">NTD</span>
          <span className="text-[44px] font-extrabold tracking-tight">{b.left < 0 ? "−" : ""}{n(Math.abs(b.left))}</span>
        </span>
      </p>
      <p className="tabular mt-2 text-right text-base font-semibold text-muted">{t("spentLine", { amount: n(b.spent) })}</p>
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
              edited={e.edited_by}
            />
          ))}
        </RowList>
      )}
    </section>
  );
}

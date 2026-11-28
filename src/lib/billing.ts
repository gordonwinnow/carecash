import "server-only";
import { db, newId } from "./db";
import { monthStart } from "./format";

/**
 * Plans, one per family (the employer pays; caretakers never see a price):
 * - a 30-day free trial from when the family was made (families that already existed count from BILLING_START);
 * - after it, FREE_PER_MONTH new entries a month (cash, expenses and Pay & health records together). History stays visible;
 * - a paid plan has no limit.
 *
 * All of this is off until BILLING_PROVIDER is set ("ecpay" or "stripe"), so the code can ship before payments do.
 */
export const TRIAL_DAYS = 30;
export const FREE_PER_MONTH = 30;
/** The yearly price in Taiwan dollars. */
export const PRICE_YEAR = 990;
/** A late renewal (a card retried a day later) shouldn't lock a family out. */
const GRACE_MS = 3 * 86_400_000;
const DAY = 86_400_000;

export type Provider = "ecpay" | "stripe";

export function billingProvider(): Provider | null {
  const p = process.env.BILLING_PROVIDER;
  return p === "ecpay" || p === "stripe" ? p : null;
}

/** When billing was turned on (BILLING_START, YYYY-MM-DD): older families' trials count from then. */
function billingStart() {
  const ms = Date.parse(`${process.env.BILLING_START ?? ""}T00:00:00+08:00`);
  return Number.isFinite(ms) ? ms : 0;
}

type FamilyPlan = { created_at: number; demo: number; paid_until: number | null; plan_provider: string | null; plan_status: string | null };

export type Plan =
  | { kind: "off" }
  | { kind: "paid"; until: number; provider: string | null; renews: boolean }
  | { kind: "trial"; ends: number; daysLeft: number }
  | { kind: "free"; used: number; limit: number; left: number };

export function entriesThisMonth(familyId: string) {
  const m = monthStart();
  const r = db
    .prepare(
      `select (select count(*) from cash where family_id = @f and created_at >= @m) +
              (select count(*) from expense where family_id = @f and created_at >= @m) +
              (select count(*) from record where family_id = @f and created_at >= @m) as n`,
    )
    .get({ f: familyId, m }) as { n: number };
  return r.n;
}

export function planOf(familyId: string, now = Date.now()): Plan {
  if (!billingProvider()) return { kind: "off" };
  const f = db.prepare("select created_at, demo, paid_until, plan_provider, plan_status from family where id = ?").get(familyId) as FamilyPlan | undefined;
  // The guest demo is a showcase: never limited
  if (!f || f.demo) return { kind: "off" };
  if (f.paid_until && f.paid_until + GRACE_MS > now) return { kind: "paid", until: f.paid_until, provider: f.plan_provider, renews: f.plan_status === "active" };
  const ends = Math.max(f.created_at, billingStart()) + TRIAL_DAYS * DAY;
  if (now < ends) return { kind: "trial", ends, daysLeft: Math.ceil((ends - now) / DAY) };
  const used = entriesThisMonth(familyId);
  return { kind: "free", used, limit: FREE_PER_MONTH, left: Math.max(0, FREE_PER_MONTH - used) };
}

/** Whether the family may add one more entry now. */
export function canAdd(familyId: string) {
  const p = planOf(familyId);
  return p.kind !== "free" || p.left > 0;
}

/**
 * A payment came in (first one or a renewal): the plan runs to `periodEnd`.
 * `ref` makes it idempotent: the same notification twice is recorded once.
 */
export function recordPayment(p: {
  familyId: string;
  provider: Provider;
  ref: string;
  amount: number;
  /** Where the plan runs to, given where it runs to now (0 if never paid). */
  periodEnd: (paidUntil: number) => number;
  subscription?: string | null;
  customer?: string | null;
}): { id: string; fresh: boolean } | null {
  return db.transaction(() => {
    const fam = db.prepare("select paid_until from family where id = ?").get(p.familyId) as { paid_until: number | null } | undefined;
    if (!fam) return null;
    const seen = db.prepare("select id from payment where ref = ?").get(p.ref) as { id: string } | undefined;
    if (seen) return { id: seen.id, fresh: false };
    const id = newId();
    const end = p.periodEnd(Math.max(fam.paid_until ?? 0, Date.now()));
    db.prepare("insert into payment (id, family_id, provider, ref, amount, currency, period_end, created_at) values (?, ?, ?, ?, ?, 'TWD', ?, ?)").run(
      id, p.familyId, p.provider, p.ref, p.amount, end, Date.now(),
    );
    db.prepare(
      `update family set paid_until = max(coalesce(paid_until, 0), ?), plan_provider = ?, plan_status = 'active',
         plan_ref = coalesce(?, plan_ref), plan_customer = coalesce(?, plan_customer) where id = ?`,
    ).run(end, p.provider, p.subscription ?? null, p.customer ?? null, p.familyId);
    return { id, fresh: true };
  })();
}

/** The subscription stopped renewing (cancelled, or the card kept failing). Paid time already bought still counts. */
export function markCanceled(familyId: string) {
  db.prepare("update family set plan_status = 'canceled' where id = ?").run(familyId);
}

export function familyByPlanRef(ref: string) {
  return (db.prepare("select id from family where plan_ref = ?").get(ref) as { id: string } | undefined)?.id ?? null;
}

/** One year on from `from` (a renewal extends from the current end, so early payments aren't lost). */
export function yearFrom(from: number) {
  const d = new Date(from);
  d.setUTCFullYear(d.getUTCFullYear() + 1);
  return d.getTime();
}

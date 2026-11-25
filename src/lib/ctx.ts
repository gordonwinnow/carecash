import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, authReady } from "./auth";
import { db } from "./db";
import { pickLang, translate, type Key, type T } from "./i18n";
import { monthStart } from "./format";

export type Member = {
  id: string;
  family_id: string;
  user_id: string;
  role: "admin" | "caretaker";
  name: string;
  family_name: string;
  currency: string;
  demo: number;
};

export async function getUser() {
  await authReady();
  const s = await auth.api.getSession({ headers: await headers() });
  return s?.user ?? null;
}

export function membershipsOf(userId: string) {
  return db
    .prepare(
      `select m.id, m.family_id, m.user_id, m.role, m.name, f.name as family_name, f.currency, f.demo
       from member m join family f on f.id = m.family_id
       where m.user_id = ? and m.active = 1 order by m.created_at`,
    )
    .all(userId) as Member[];
}

export async function getCtx() {
  const user = await getUser();
  if (!user) return { user: null, me: null, memberships: [] as Member[] };
  const memberships = membershipsOf(user.id);
  const fid = (await cookies()).get("fid")?.value;
  const me = memberships.find((m) => m.family_id === fid) ?? memberships[0] ?? null;
  return { user, me, memberships };
}

/** For pages and actions that need a signed-in family member. */
export async function requireCtx() {
  const c = await getCtx();
  if (!c.user) redirect("/sign-in");
  if (!c.me) redirect("/start");
  return c as { user: NonNullable<typeof c.user>; me: Member; memberships: Member[] };
}

export async function requireAdmin() {
  const c = await requireCtx();
  if (c.me.role !== "admin") redirect("/home");
  return c;
}

export async function getLang() {
  const c = await cookies();
  return pickLang(c.get("lang")?.value, (await headers()).get("accept-language"));
}

export async function getT(): Promise<T> {
  const lang = await getLang();
  return (key: Key, vars) => translate(lang, key, vars);
}

/**
 * Money left is cumulative (it is real cash in the caretaker's pocket), shown as
 * last month's leftover + received this month − spent this month. Cash counts from the moment it is acknowledged.
 */
export function balanceOf(caretakerId: string) {
  return balanceFor("= @id", { id: caretakerId });
}

/**
 * The family's own cash pot: household cash any employer put in for themselves, minus what any employer paid.
 * Shared by all employers of the family, so one employer can add cash and another spend it.
 */
export function familyPotBalance(familyId: string) {
  return balanceFor("in (select id from member where family_id = @fid and role = 'admin')", { fid: familyId });
}

function balanceFor(who: string, params: Record<string, string>) {
  const r = db
    .prepare(
      `select
        (select coalesce(sum(amount),0) from cash where caretaker_id ${who} and ack_at is not null and ack_at < @m) -
        (select coalesce(sum(amount),0) from expense where member_id ${who} and spent_at < @m) as carry,
        (select coalesce(sum(amount),0) from cash where caretaker_id ${who} and ack_at >= @m) as received,
        (select coalesce(sum(amount),0) from cash where caretaker_id ${who} and ack_at is null) as pending,
        (select coalesce(sum(amount),0) from expense where member_id ${who} and spent_at >= @m) as spent`,
    )
    .get({ ...params, m: monthStart() }) as { carry: number; received: number; pending: number; spent: number };
  return { ...r, left: r.carry + r.received - r.spent };
}

/**
 * The people who run the app and answer feedback: the accounts whose email is in OWNER_EMAILS (comma separated).
 * Set it as a server secret, never in the code.
 */
export function isOwner(user: { email?: string | null } | null | undefined) {
  const list = (process.env.OWNER_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  return !!user?.email && list.includes(user.email.toLowerCase());
}

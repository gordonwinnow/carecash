import "server-only";
import { db } from "./db";

/**
 * Growth numbers for the owners (page /stats, and /api/metrics for scripts/metrics.mjs).
 * Guest demo users and demo families are left out everywhere.
 *
 * - signup: a real (non-guest) account was created
 * - household: a real family was created; `source` is the ?ref= / utm_source its first employer came with
 * - activated household: has a caretaker who joined and at least one expense
 * - weekly active user: did something in the app (any add, edit, confirm…) in the 7 days,
 *   or, for the current week only, opened it (sessions refresh at most once a day)
 */
const DAY = 86400_000;
const WEEK = 7 * DAY;

type UserRow = { id: string; createdAt: string | number; isAnonymous: number | null; email: string };

function realUsers() {
  const rows = db.prepare(`select id, createdAt, isAnonymous, email from user`).all() as UserRow[];
  return rows
    .filter((u) => !u.isAnonymous && !u.email.endsWith("@demo.carecash.local"))
    .map((u) => ({ id: u.id, at: new Date(u.createdAt).getTime() }));
}

function actorsBetween(from: number, to: number) {
  return (
    db
      .prepare(
        `select distinct m.user_id as id from audit a
         join member m on m.id = a.member_id
         join family f on f.id = a.family_id
         where f.demo = 0 and a.at >= ? and a.at < ?`,
      )
      .all(from, to) as { id: string }[]
  ).map((r) => r.id);
}

function openedSince(from: number, real: Set<string>) {
  const rows = db.prepare(`select distinct userId as id, updatedAt from session`).all() as { id: string; updatedAt: string | number }[];
  return rows.filter((r) => real.has(r.id) && new Date(r.updatedAt).getTime() >= from).map((r) => r.id);
}

export function metrics(now = Date.now()) {
  const users = realUsers();
  const real = new Set(users.map((u) => u.id));
  const families = db
    .prepare(
      `select f.id, f.created_at, coalesce(f.source, '(direct)') as source,
        exists(select 1 from member m where m.family_id = f.id and m.role = 'caretaker' and m.active = 1) as has_caretaker,
        exists(select 1 from expense e where e.family_id = f.id) as has_expense,
        exists(select 1 from expense e join member m on m.id = e.member_id where e.family_id = f.id and m.role = 'caretaker') as caretaker_logged,
        exists(select 1 from cash c where c.family_id = f.id) as has_cash,
        (select max(at) from audit a where a.family_id = f.id) as last_at
       from family f where f.demo = 0`,
    )
    .all() as { id: string; created_at: number; source: string; has_caretaker: number; has_expense: number; caretaker_logged: number; has_cash: number; last_at: number | null }[];

  const weekStart = now - WEEK;
  const activeNow = new Set([...actorsBetween(weekStart, now + 1), ...openedSince(weekStart, real)].filter((id) => real.has(id)));

  const weeks = Array.from({ length: 8 }, (_, i) => {
    const to = now - i * WEEK;
    const from = to - WEEK;
    return {
      weekEnding: new Date(to).toISOString().slice(0, 10),
      signups: users.filter((u) => u.at >= from && u.at < to).length,
      households: families.filter((f) => f.created_at >= from && f.created_at < to).length,
      activeUsers: i === 0 ? activeNow.size : actorsBetween(from, to).filter((id) => real.has(id)).length,
    };
  });

  const bySource = new Map<string, { households: number; activated: number; activeLast7d: number }>();
  for (const f of families) {
    const s = bySource.get(f.source) ?? { households: 0, activated: 0, activeLast7d: 0 };
    s.households++;
    if (f.has_caretaker && f.has_expense) s.activated++;
    if (f.last_at && f.last_at >= weekStart) s.activeLast7d++;
    bySource.set(f.source, s);
  }

  // Where families stall: each step counts households (except the first, which counts accounts)
  const funnel = [
    { step: "Signed up (accounts)", count: users.length },
    { step: "Created a family", count: families.length },
    { step: "Gave household cash", count: families.filter((f) => f.has_cash).length },
    { step: "Caregiver joined", count: families.filter((f) => f.has_caretaker).length },
    { step: "Caregiver logged an expense", count: families.filter((f) => f.caretaker_logged).length },
    { step: "Active in the last 7 days", count: families.filter((f) => f.last_at && f.last_at >= weekStart).length },
  ];

  return {
    at: new Date(now).toISOString(),
    funnel,
    goal: { signups: 1000, weeklyActiveUsers: 100 },
    totals: {
      signups: users.length,
      households: families.length,
      householdsWithCaretaker: families.filter((f) => f.has_caretaker).length,
      activatedHouseholds: families.filter((f) => f.has_caretaker && f.has_expense).length,
      weeklyActiveUsers: activeNow.size,
      weeklyActiveHouseholds: families.filter((f) => f.last_at && f.last_at >= weekStart).length,
    },
    weeks,
    sources: [...bySource.entries()].map(([source, v]) => ({ source, ...v })).sort((a, b) => b.households - a.households),
  };
}

export type Metrics = ReturnType<typeof metrics>;

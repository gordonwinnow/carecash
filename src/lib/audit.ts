import { db, newId } from "./db";

export type Entity = "cash" | "expense" | "record" | "member";
export type AuditAction = "create" | "update" | "delete" | "ack" | "confirm" | "share" | "unshare" | "join" | "remove";

export type AuditRow = {
  id: string;
  member_id: string;
  actor: string | null;
  entity: Entity;
  entity_id: string;
  action: AuditAction;
  before: string | null;
  after: string | null;
  at: number;
};

/**
 * Records one change. `subject` is the caretaker the row is about (cash, expenses), so she can see its history too.
 * Salary and health records have no subject: their history is for employers only.
 */
export function logChange(
  familyId: string,
  actorId: string,
  entity: Entity,
  entityId: string,
  action: AuditAction,
  before: object | null,
  after: object | null,
  subject: string | null = null,
) {
  db.prepare(
    "insert into audit (id, family_id, member_id, subject_id, entity, entity_id, action, before, after, at) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
  ).run(newId(), familyId, actorId, subject, entity, entityId, action, before && JSON.stringify(before), after && JSON.stringify(after), Date.now());
}

const SELECT = `select a.*, m.name as actor from audit a left join member m on m.id = a.member_id`;

/** History of one entry, newest first, filtered to what this member may see. */
export function historyOf(entityId: string, me: { id: string; role: string; family_id: string }) {
  return db
    .prepare(`${SELECT} where a.family_id = ? and a.entity_id = ? and (? = 'admin' or a.subject_id = ?) order by a.at desc`)
    .all(me.family_id, entityId, me.role, me.id) as AuditRow[];
}

/** The family's recent changes, newest first. Caretakers only see changes to their own cash and expenses. */
export function familyActivity(me: { id: string; role: string; family_id: string }, limit = 200) {
  return db
    .prepare(`${SELECT} where a.family_id = ? and (? = 'admin' or a.subject_id = ?) order by a.at desc limit ?`)
    .all(me.family_id, me.role, me.id, limit) as AuditRow[];
}

/** Field-by-field differences between two snapshots, for showing "amount 300 → 350". */
export function diff(row: AuditRow) {
  const b = (row.before ? JSON.parse(row.before) : {}) as Record<string, unknown>;
  const a = (row.after ? JSON.parse(row.after) : {}) as Record<string, unknown>;
  if (row.action !== "update") return [];
  return Object.keys({ ...b, ...a })
    .filter((k) => JSON.stringify(b[k] ?? null) !== JSON.stringify(a[k] ?? null))
    .map((k) => ({ field: k, from: b[k] ?? null, to: a[k] ?? null }));
}

/** The snapshot to describe a row with: the new values, or the old ones for a delete. */
export function snapshot(row: AuditRow) {
  const s = row.after ?? row.before;
  return (s ? JSON.parse(s) : {}) as Record<string, unknown>;
}

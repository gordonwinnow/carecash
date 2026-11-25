"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, newId } from "@/lib/db";
import { savePhoto } from "@/lib/photos";
import { getLang, getUser, isOwner, requireAdmin, requireCtx, membershipsOf } from "@/lib/ctx";
import { CATEGORIES, KINDS, dayKey, movedDate } from "@/lib/format";
import { seedDemo } from "@/lib/demo";
import { logChange } from "@/lib/audit";
import { deliver, watchBalance } from "@/lib/notify";
import { normalizeCarrier } from "@/lib/carrier";
import { ownerUserIds, updateFeedback } from "@/lib/feedback";

const COOKIE = { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" as const };

function amountOf(fd: FormData) {
  const n = Math.round(Number(String(fd.get("amount") ?? "").replace(/[^\d.]/g, "")));
  if (!Number.isFinite(n) || n <= 0 || n > 10_000_000) throw new Error("Bad amount");
  return n;
}
function text(fd: FormData, key: string, max = 200) {
  const v = String(fd.get(key) ?? "").trim();
  return v ? v.slice(0, max) : null;
}
function done(to?: string) {
  revalidatePath("/", "layout");
  if (to) redirect(to);
}

// Row shapes kept in the change history (photos are recorded by name only)
type CashRow = { id: string; family_id: string; caretaker_id: string; amount: number; note: string | null; created_by: string | null; created_at: number; ack_at: number | null; confirmed_at: number | null };
type ExpenseRow = { id: string; family_id: string; member_id: string; amount: number; category: string; note: string | null; photo: string | null; spent_at: number };
type RecordRow = { id: string; family_id: string; caretaker_id: string | null; kind: string; amount: number; note: string | null; photo: string | null; date: string; shared: number; ack_at: number | null };

const cashView = (r: CashRow) => ({ amount: r.amount, note: r.note, date: dayKey(r.ack_at ?? r.created_at) });
const expenseView = (r: ExpenseRow) => ({ amount: r.amount, category: r.category, note: r.note, photo: r.photo, payer: r.member_id, date: dayKey(r.spent_at) });
const recordView = (r: RecordRow) => ({ kind: r.kind, amount: r.amount, note: r.note, date: r.date, shared: r.shared, caretaker_id: r.caretaker_id, photo: r.photo });

// ---------- Family ----------

export async function createFamily(fd: FormData) {
  const user = await getUser();
  if (!user) redirect("/sign-in");
  const name = text(fd, "name", 60) ?? "My family";
  const fid = newId();
  const mid = newId();
  const now = Date.now();
  db.transaction(() => {
    db.prepare("insert into family (id, name, created_at) values (?, ?, ?)").run(fid, name, now);
    db.prepare("insert into member (id, family_id, user_id, role, name, created_at) values (?, ?, ?, 'admin', ?, ?)").run(
      mid, fid, user.id, user.name || "Employer", now,
    );
    logChange(fid, mid, "member", mid, "create", null, { name: user.name || "Employer", role: "admin" });
  })();
  (await cookies()).set("fid", fid, COOKIE);
  done("/home");
}

export async function createInvite(role: "admin" | "caretaker") {
  const { me } = await requireAdmin();
  if (me.demo) throw new Error("No invites in the demo");
  if (role !== "admin" && role !== "caretaker") throw new Error("Bad role");
  const code = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  const now = Date.now();
  db.prepare("insert into invite (code, family_id, role, created_by, created_at, expires_at) values (?, ?, ?, ?, ?, ?)").run(
    code, me.family_id, role, me.id, now, now + 7 * 24 * 3600 * 1000,
  );
  return code;
}

export async function joinFamily(code: string, fd: FormData) {
  const user = await getUser();
  if (!user) redirect(`/sign-in?next=/join/${code}`);
  const inv = db.prepare("select * from invite where code = ? and expires_at > ?").get(code, Date.now()) as
    | { family_id: string; role: string }
    | undefined;
  if (!inv) redirect(`/join/${code}`);
  const name = text(fd, "name", 40) ?? user.name ?? "";
  const existing = db.prepare("select id from member where family_id = ? and user_id = ?").get(inv.family_id, user.id) as
    | { id: string }
    | undefined;
  db.transaction(() => {
    const mid = existing?.id ?? newId();
    if (existing) {
      db.prepare("update member set active = 1, role = ?, name = ? where id = ?").run(inv.role, name, mid);
    } else {
      db.prepare("insert into member (id, family_id, user_id, role, name, created_at) values (?, ?, ?, ?, ?, ?)").run(
        mid, inv.family_id, user.id, inv.role, name, Date.now(),
      );
    }
    logChange(inv.family_id, mid, "member", mid, "join", null, { name, role: inv.role });
    db.prepare("delete from invite where code = ?").run(code);
  })();
  (await cookies()).set("fid", inv.family_id, COOKIE);
  done("/home");
}

export async function switchFamily(fid: string) {
  const user = await getUser();
  if (!user) redirect("/sign-in");
  if (membershipsOf(user.id).some((m) => m.family_id === fid)) (await cookies()).set("fid", fid, COOKIE);
  done("/home");
}

export async function renameMe(fd: FormData) {
  const { me } = await requireCtx();
  const name = text(fd, "name", 40);
  if (!name || name === me.name) return done();
  db.prepare("update member set name = ? where id = ?").run(name, me.id);
  logChange(me.family_id, me.id, "member", me.id, "update", { name: me.name }, { name });
  done();
}

export async function removeMember(memberId: string) {
  const { me } = await requireAdmin();
  if (memberId === me.id) return;
  const m = db.prepare("select name, role from member where id = ? and family_id = ? and active = 1").get(memberId, me.family_id) as
    | { name: string; role: string }
    | undefined;
  if (!m) return;
  db.prepare("update member set active = 0 where id = ?").run(memberId);
  logChange(me.family_id, me.id, "member", memberId, "remove", m, null);
  done();
}

// ---------- Phase 1: cash and expenses ----------

/**
 * Money goes both ways:
 * - an employer adds it for a caretaker, and the caretaker acknowledges it (ack_at);
 * - a caretaker records money an employer handed her. It counts at once, and an employer confirms it (confirmed_at).
 */
export async function giveCash(fd: FormData) {
  const { me } = await requireCtx();
  // The chosen day (today keeps the current moment)
  const now = movedDate(fd.get("date"), Date.now());
  const other = String(fd.get("who") ?? "");
  // An employer may also put cash into their own pot (no caretaker involved): it counts and is confirmed at once
  const toSelf = me.role === "admin" && other === me.id;
  const wantRole = me.role === "admin" ? "caretaker" : "admin";
  const ok = toSelf || db.prepare("select 1 from member where id = ? and family_id = ? and role = ? and active = 1").get(other, me.family_id, wantRole);
  if (!ok) throw new Error("Unknown member");
  const [caretaker, giver, ack] = toSelf ? [me.id, me.id, now] : me.role === "admin" ? [other, me.id, null] : [me.id, other, now];
  const id = newId();
  const amount = amountOf(fd);
  const note = text(fd, "note");
  await watchBalance(
    me.family_id,
    caretaker,
    () => {
      db.prepare(
        "insert into cash (id, family_id, caretaker_id, amount, note, given_by, created_by, created_at, ack_at, confirmed_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      ).run(id, me.family_id, caretaker, amount, note, giver, me.id, now, ack, toSelf ? now : null);
      logChange(me.family_id, me.id, "cash", id, "create", null, { amount, note }, toSelf ? null : caretaker);
    },
    { actorId: me.id, actorName: me.name, kind: "cash", amount },
  );
  done("/home");
}

function getCash(id: string, familyId: string) {
  return db.prepare("select * from cash where id = ? and family_id = ?").get(id, familyId) as CashRow | undefined;
}

/** Who may change a cash row: employers always; a caretaker only the money she recorded herself. */
function canEditCash(me: { id: string; role: string }, c: CashRow) {
  return me.role === "admin" || (c.created_by === me.id && c.caretaker_id === me.id);
}

export async function updateCash(cashId: string, fd: FormData) {
  const { me } = await requireCtx();
  const c = getCash(cashId, me.family_id);
  if (!c || !canEditCash(me, c)) redirect("/history");
  const amount = amountOf(fd);
  const note = text(fd, "note");
  const selfAdded = c.created_by === c.caretaker_id;
  let { ack_at, confirmed_at } = c;
  if (amount !== c.amount) {
    // A changed amount has to be agreed again by the other side
    if (!selfAdded) ack_at = null;
    else confirmed_at = me.role === "admin" ? Date.now() : null;
  }
  // The date is when the money was handed over; moving it also moves it to that month's balance
  const at = movedDate(fd.get("date"), c.ack_at ?? c.created_at);
  const moved = at !== (c.ack_at ?? c.created_at);
  const created_at = moved ? at : c.created_at;
  if (moved && ack_at) ack_at = at;
  await watchBalance(me.family_id, c.caretaker_id, () => {
    db.prepare("update cash set amount = ?, note = ?, ack_at = ?, confirmed_at = ?, created_at = ? where id = ?").run(amount, note, ack_at, confirmed_at, created_at, c.id);
    logChange(me.family_id, me.id, "cash", c.id, "update", cashView(c), { amount, note, date: dayKey(at) }, c.caretaker_id);
  });
  done("/history");
}

export async function ackCash(cashId: string) {
  const { me } = await requireCtx();
  await watchBalance(me.family_id, me.id, () => {
    const r = db.prepare("update cash set ack_at = ? where id = ? and caretaker_id = ? and ack_at is null").run(Date.now(), cashId, me.id);
    if (r.changes) logChange(me.family_id, me.id, "cash", cashId, "ack", null, null, me.id);
  });
  done();
}

export async function confirmCash(cashId: string) {
  const { me } = await requireAdmin();
  const c = getCash(cashId, me.family_id);
  const r = db.prepare("update cash set confirmed_at = ? where id = ? and family_id = ? and confirmed_at is null").run(Date.now(), cashId, me.family_id);
  if (c && r.changes) logChange(me.family_id, me.id, "cash", cashId, "confirm", null, null, c.caretaker_id);
  done();
}

export async function deleteCash(cashId: string, to?: string) {
  const { me } = await requireCtx();
  const c = getCash(cashId, me.family_id);
  // A caretaker may remove her own entry until an employer has confirmed it
  const ok = c && (me.role === "admin" || (canEditCash(me, c) && !c.confirmed_at));
  if (ok)
    await watchBalance(me.family_id, c.caretaker_id, () => {
      db.prepare("delete from cash where id = ?").run(c.id);
      logChange(me.family_id, me.id, "cash", c.id, "delete", cashView(c), null, c.caretaker_id);
    });
  done(to);
}

// ---------- Guest demo ----------

export async function startDemo(role: "admin" | "caretaker") {
  const user = await getUser();
  if (!user || !(user as { isAnonymous?: boolean }).isAnonymous) redirect("/sign-in");
  const fid = seedDemo(user.id, role === "caretaker" ? "caretaker" : "admin");
  (await cookies()).set("fid", fid, COOKIE);
  done("/home");
}

function categoryOf(fd: FormData) {
  return CATEGORIES.some((c) => c.id === fd.get("category")) ? String(fd.get("category")) : "other";
}

/**
 * Who paid: a caretaker always pays from her own household cash. An employer picks the caretaker whose cash
 * it came from, or themselves (then no caretaker's balance changes).
 */
function payerOf(fd: FormData, me: { id: string; role: string; family_id: string }) {
  if (me.role !== "admin") return { id: me.id, caretaker: true };
  const row = db.prepare("select id, role from member where id = ? and family_id = ? and active = 1").get(String(fd.get("payer") ?? ""), me.family_id) as
    | { id: string; role: string }
    | undefined;
  return row ? { id: row.id, caretaker: row.role === "caretaker" } : { id: me.id, caretaker: false };
}

export async function addExpense(fd: FormData) {
  const { me } = await requireCtx();
  const payer = payerOf(fd, me);
  const category = categoryOf(fd);
  const amount = amountOf(fd);
  const note = text(fd, "note");
  const photo = await savePhoto(fd);
  const now = movedDate(fd.get("date"), Date.now());
  const id = newId();
  await watchBalance(
    me.family_id,
    payer.id,
    () => {
      db.prepare(
        "insert into expense (id, family_id, member_id, amount, category, note, photo, spent_at, created_at, created_by) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      ).run(id, me.family_id, payer.id, amount, category, note, photo, now, now, me.id);
      logChange(me.family_id, me.id, "expense", id, "create", null, { amount, category, note, photo, payer: payer.id }, payer.caretaker ? payer.id : null);
    },
    { actorId: me.id, actorName: me.name, kind: "expense", amount, category },
  );
  done("/home");
}

function getExpense(id: string, familyId: string) {
  return db.prepare("select * from expense where id = ? and family_id = ?").get(id, familyId) as ExpenseRow | undefined;
}

export async function updateExpense(expenseId: string, fd: FormData) {
  const { me } = await requireCtx();
  const e = getExpense(expenseId, me.family_id);
  if (!e || (me.role !== "admin" && e.member_id !== me.id)) redirect("/history");
  const amount = amountOf(fd);
  const category = categoryOf(fd);
  const note = text(fd, "note");
  // The old photo file is kept: the change history still points at it
  const photo = (await savePhoto(fd)) ?? e.photo;
  // Employers may also change who paid
  const payer = me.role === "admin" ? payerOf(fd, me).id : e.member_id;
  const spentAt = movedDate(fd.get("date"), e.spent_at);
  const isCaretaker = (id: string) => !!db.prepare("select 1 from member where id = ? and role = 'caretaker'").get(id);
  await watchBalance(me.family_id, payer, () => {
    db.prepare("update expense set amount = ?, category = ?, note = ?, photo = ?, member_id = ?, spent_at = ? where id = ?").run(amount, category, note, photo, payer, spentAt, e.id);
    logChange(me.family_id, me.id, "expense", e.id, "update", expenseView(e), { amount, category, note, photo, payer, date: dayKey(spentAt) }, isCaretaker(payer) ? payer : isCaretaker(e.member_id) ? e.member_id : null);
  });
  done("/history");
}

export async function deleteExpense(expenseId: string, to?: string) {
  const { me } = await requireCtx();
  const e = getExpense(expenseId, me.family_id);
  if (e && (me.role === "admin" || e.member_id === me.id))
    await watchBalance(me.family_id, e.member_id, () => {
      db.prepare("delete from expense where id = ?").run(e.id);
      logChange(me.family_id, me.id, "expense", e.id, "delete", expenseView(e), null, e.member_id);
    });
  done(to);
}

// ---------- Phase 2: salary, healthcare, other (employers only) ----------

function recordFields(fd: FormData, familyId: string) {
  const kind = KINDS.some((k) => k.id === fd.get("kind")) ? String(fd.get("kind")) : "other";
  const who = String(fd.get("caretaker") ?? "");
  const caretaker = who
    ? ((db.prepare("select id from member where id = ? and family_id = ? and role = 'caretaker'").get(who, familyId) as { id: string } | undefined)?.id ?? null)
    : null;
  const date = /^\d{4}-\d{2}-\d{2}$/.test(String(fd.get("date"))) ? String(fd.get("date")) : new Date().toISOString().slice(0, 10);
  // A salary paid to a caretaker is always shown to her, since she confirms she received it
  const salaryFor = kind === "salary" && !!caretaker;
  return { kind, caretaker_id: caretaker, date, amount: amountOf(fd), note: text(fd, "note"), shared: salaryFor || fd.get("shared") ? 1 : 0 };
}
const needsAck = (r: { kind: string; caretaker_id: string | null }) => r.kind === "salary" && !!r.caretaker_id;

export async function addRecord(fd: FormData) {
  const { me } = await requireAdmin();
  const f = recordFields(fd, me.family_id);
  const photo = await savePhoto(fd);
  const id = newId();
  db.prepare(
    "insert into record (id, family_id, caretaker_id, kind, amount, note, photo, date, shared, created_by, created_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
  ).run(id, me.family_id, f.caretaker_id, f.kind, f.amount, f.note, photo, f.date, f.shared, me.id, Date.now());
  logChange(me.family_id, me.id, "record", id, "create", null, { ...f, photo }, needsAck(f) ? f.caretaker_id : null);
  done("/more");
}

function getRecord(id: string, familyId: string) {
  return db.prepare("select * from record where id = ? and family_id = ?").get(id, familyId) as RecordRow | undefined;
}

export async function updateRecord(recordId: string, fd: FormData) {
  const { me } = await requireAdmin();
  const r = getRecord(recordId, me.family_id);
  if (!r) redirect("/more");
  const f = recordFields(fd, me.family_id);
  const photo = (await savePhoto(fd)) ?? r.photo;
  // A salary she already confirmed has to be confirmed again if the amount or the person changes
  const ack_at = needsAck(f) && needsAck(r) && f.amount === r.amount && f.caretaker_id === r.caretaker_id ? r.ack_at : null;
  db.prepare("update record set kind = ?, amount = ?, note = ?, date = ?, shared = ?, caretaker_id = ?, photo = ?, ack_at = ? where id = ?").run(
    f.kind, f.amount, f.note, f.date, f.shared, f.caretaker_id, photo, ack_at, r.id,
  );
  logChange(me.family_id, me.id, "record", r.id, "update", recordView(r), { ...f, photo }, needsAck(f) ? f.caretaker_id : null);
  done("/more");
}

export async function toggleShare(recordId: string) {
  const { me } = await requireAdmin();
  const r = getRecord(recordId, me.family_id);
  if (!r || needsAck(r)) return; // a caretaker's salary always stays visible to her
  db.prepare("update record set shared = ? where id = ?").run(r.shared ? 0 : 1, r.id);
  logChange(me.family_id, me.id, "record", r.id, r.shared ? "unshare" : "share", null, null);
  done();
}

/** The caretaker confirms she received her salary. */
export async function ackRecord(recordId: string) {
  const { me } = await requireCtx();
  const r = db
    .prepare("update record set ack_at = ? where id = ? and caretaker_id = ? and kind = 'salary' and ack_at is null")
    .run(Date.now(), recordId, me.id);
  if (r.changes) logChange(me.family_id, me.id, "record", recordId, "ack", null, null, me.id);
  done();
}

export async function deleteRecord(recordId: string, to?: string) {
  const { me } = await requireAdmin();
  const r = getRecord(recordId, me.family_id);
  if (r) {
    db.prepare("delete from record where id = ?").run(r.id);
    logChange(me.family_id, me.id, "record", r.id, "delete", recordView(r), null);
  }
  done(to);
}

// ---------- Notifications ----------

export async function saveNotify(settings: { notify_low: boolean; low_threshold: number; notify_expense: boolean; notify_cash: boolean }) {
  const { me } = await requireCtx();
  const threshold = Math.min(10_000_000, Math.max(0, Math.round(Number(settings.low_threshold) || 0)));
  db.prepare("update member set notify_low = ?, low_threshold = ?, notify_expense = ?, notify_cash = ? where id = ?").run(
    settings.notify_low ? 1 : 0, threshold, settings.notify_expense ? 1 : 0, settings.notify_cash ? 1 : 0, me.id,
  );
  revalidatePath("/settings");
}

/** Remembers this device: a browser's Web Push subscription, or the iOS app's APNs token. */
export async function addDevice(device: { kind: "web"; endpoint: string; keys: { p256dh: string; auth: string } } | { kind: "apns"; token: string }) {
  const user = await getUser();
  if (!user) return;
  const lang = await getLang();
  const endpoint = device.kind === "web" ? device.endpoint : device.token;
  if (device.kind === "web" ? !/^https:\/\//.test(endpoint) : !/^[0-9a-f]{32,200}$/i.test(endpoint)) throw new Error("Bad device");
  const keys = device.kind === "web" ? JSON.stringify({ p256dh: device.keys.p256dh, auth: device.keys.auth }) : null;
  db.prepare(
    `insert into push_sub (id, user_id, kind, endpoint, keys, lang, created_at) values (?, ?, ?, ?, ?, ?, ?)
     on conflict(endpoint) do update set user_id = excluded.user_id, keys = excluded.keys, lang = excluded.lang`,
  ).run(newId(), user.id, device.kind, endpoint, keys, lang, Date.now());
}

export async function removeDevice(endpoint: string) {
  const user = await getUser();
  if (user) db.prepare("delete from push_sub where endpoint = ? and user_id = ?").run(endpoint, user.id);
}


// ---------- E-invoice barcode (發票載具) ----------

/**
 * An employer shares the family's mobile barcode. A typed code is preferred (it is drawn sharp at any size);
 * a screenshot of the barcode is the fallback. Saving one clears the other.
 */
export async function saveCarrier(fd: FormData) {
  const { me } = await requireAdmin();
  const before = db.prepare("select carrier as code, carrier_photo as photo from family where id = ?").get(me.family_id) as { code: string | null; photo: string | null };
  const raw = String(fd.get("code") ?? "").trim();
  const code = raw ? normalizeCarrier(raw) : null;
  if (raw && !code) throw new Error("Bad code");
  const photo = code ? null : await savePhoto(fd);
  if (!code && !photo) return done("/carrier");
  db.prepare("update family set carrier = ?, carrier_photo = ? where id = ?").run(code, photo, me.family_id);
  logChange(me.family_id, me.id, "carrier", me.family_id, before.code || before.photo ? "update" : "create", before.code || before.photo ? before : null, { code, photo });
  done("/carrier");
}

export async function removeCarrier() {
  const { me } = await requireAdmin();
  const before = db.prepare("select carrier as code, carrier_photo as photo from family where id = ?").get(me.family_id) as { code: string | null; photo: string | null };
  if (!before.code && !before.photo) return done("/carrier");
  db.prepare("update family set carrier = null, carrier_photo = null where id = ?").run(me.family_id);
  logChange(me.family_id, me.id, "carrier", me.family_id, "delete", before, null);
  done("/carrier");
}

// ---------- Feedback ----------

/** Anyone signed in can send a feature request or a problem, with an optional screenshot. The app's owners get a push. */
export async function sendFeedback(fd: FormData) {
  const { user, me } = await requireCtx();
  const body = text(fd, "body", 4000);
  if (!body) return done("/feedback");
  const photo = await savePhoto(fd);
  const now = Date.now();
  db.prepare("insert into feedback (id, user_id, family_id, name, body, photo, status, created_at, updated_at) values (?, ?, ?, ?, ?, ?, 'new', ?, ?)").run(
    newId(), user.id, me.family_id, me.name, body, photo, now, now,
  );
  for (const id of ownerUserIds()) if (id !== user.id) deliver(id, "/feedback/review", () => `${me.name}: ${body.slice(0, 120)}`);
  done("/feedback?sent=1");
}

/** The app's owners set a status and a reply. */
export async function reviewFeedback(id: string, fd: FormData) {
  const user = await getUser();
  if (!isOwner(user)) throw new Error("Not allowed");
  updateFeedback(id, String(fd.get("status") ?? ""), text(fd, "reply", 4000));
  done("/feedback/review");
}

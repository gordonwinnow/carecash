"use server";
import fs from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, newId, UPLOAD_DIR } from "@/lib/db";
import { getUser, requireAdmin, requireCtx, membershipsOf } from "@/lib/ctx";
import { CATEGORIES, KINDS } from "@/lib/format";
import { seedDemo } from "@/lib/demo";

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
async function savePhoto(fd: FormData) {
  const f = fd.get("photo");
  if (!(f instanceof File) || f.size === 0) return null;
  if (f.size > 9 * 1024 * 1024 || !f.type.startsWith("image/")) throw new Error("Bad photo");
  const name = `${newId()}.jpg`;
  await fs.promises.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await f.arrayBuffer()));
  return name;
}
function removePhoto(name: string | null | undefined) {
  if (name) fs.promises.unlink(path.join(UPLOAD_DIR, name)).catch(() => {});
}
function done(to?: string) {
  revalidatePath("/", "layout");
  if (to) redirect(to);
}

// ---------- Family ----------

export async function createFamily(fd: FormData) {
  const user = await getUser();
  if (!user) redirect("/sign-in");
  const name = text(fd, "name", 60) ?? "My family";
  const fid = newId();
  const now = Date.now();
  db.transaction(() => {
    db.prepare("insert into family (id, name, created_at) values (?, ?, ?)").run(fid, name, now);
    db.prepare("insert into member (id, family_id, user_id, role, name, created_at) values (?, ?, ?, 'admin', ?, ?)").run(
      newId(), fid, user.id, user.name || "Employer", now,
    );
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
    if (existing) {
      db.prepare("update member set active = 1, role = ?, name = ? where id = ?").run(inv.role, name, existing.id);
    } else {
      db.prepare("insert into member (id, family_id, user_id, role, name, created_at) values (?, ?, ?, ?, ?, ?)").run(
        newId(), inv.family_id, user.id, inv.role, name, Date.now(),
      );
    }
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
  if (name) db.prepare("update member set name = ? where id = ?").run(name, me.id);
  done();
}

export async function removeMember(memberId: string) {
  const { me } = await requireAdmin();
  if (memberId === me.id) return;
  db.prepare("update member set active = 0 where id = ? and family_id = ?").run(memberId, me.family_id);
  done();
}

// ---------- Phase 1: cash and expenses ----------

/**
 * Money goes both ways:
 * - a master adds it for a caretaker, and the caretaker acknowledges it (ack_at);
 * - a caretaker records money a master handed her. It counts at once, and a master confirms it (confirmed_at).
 */
export async function giveCash(fd: FormData) {
  const { me } = await requireCtx();
  const now = Date.now();
  const other = String(fd.get("who") ?? "");
  const wantRole = me.role === "admin" ? "caretaker" : "admin";
  const ok = db.prepare("select 1 from member where id = ? and family_id = ? and role = ? and active = 1").get(other, me.family_id, wantRole);
  if (!ok) throw new Error("Unknown member");
  const [caretaker, giver, ack] = me.role === "admin" ? [other, me.id, null] : [me.id, other, now];
  db.prepare(
    "insert into cash (id, family_id, caretaker_id, amount, note, given_by, created_by, created_at, ack_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?)",
  ).run(newId(), me.family_id, caretaker, amountOf(fd), text(fd, "note"), giver, me.id, now, ack);
  done("/home");
}

export async function ackCash(cashId: string) {
  const { me } = await requireCtx();
  db.prepare("update cash set ack_at = ? where id = ? and caretaker_id = ? and ack_at is null").run(Date.now(), cashId, me.id);
  done();
}

export async function confirmCash(cashId: string) {
  const { me } = await requireAdmin();
  db.prepare("update cash set confirmed_at = ? where id = ? and family_id = ? and confirmed_at is null").run(Date.now(), cashId, me.family_id);
  done();
}

export async function deleteCash(cashId: string) {
  const { me } = await requireCtx();
  if (me.role === "admin") db.prepare("delete from cash where id = ? and family_id = ?").run(cashId, me.family_id);
  // A caretaker may remove her own entry until a master has confirmed it
  else db.prepare("delete from cash where id = ? and created_by = ? and confirmed_at is null").run(cashId, me.id);
  done();
}

// ---------- Guest demo ----------

export async function startDemo(role: "admin" | "caretaker") {
  const user = await getUser();
  if (!user || !(user as { isAnonymous?: boolean }).isAnonymous) redirect("/sign-in");
  const fid = seedDemo(user.id, role === "caretaker" ? "caretaker" : "admin");
  (await cookies()).set("fid", fid, COOKIE);
  done("/home");
}

export async function addExpense(fd: FormData) {
  const { me } = await requireCtx();
  const category = CATEGORIES.some((c) => c.id === fd.get("category")) ? String(fd.get("category")) : "other";
  const amount = amountOf(fd);
  const photo = await savePhoto(fd);
  const now = Date.now();
  db.prepare(
    "insert into expense (id, family_id, member_id, amount, category, note, photo, spent_at, created_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?)",
  ).run(newId(), me.family_id, me.id, amount, category, text(fd, "note"), photo, now, now);
  done("/home");
}

export async function deleteExpense(expenseId: string) {
  const { me } = await requireCtx();
  const row = db.prepare("select member_id, photo from expense where id = ? and family_id = ?").get(expenseId, me.family_id) as
    | { member_id: string; photo: string | null }
    | undefined;
  if (!row || (me.role !== "admin" && row.member_id !== me.id)) return;
  db.prepare("delete from expense where id = ?").run(expenseId);
  removePhoto(row.photo);
  done();
}

// ---------- Phase 2: salary, healthcare, other (masters only) ----------

export async function addRecord(fd: FormData) {
  const { me } = await requireAdmin();
  const kind = KINDS.some((k) => k.id === fd.get("kind")) ? String(fd.get("kind")) : "other";
  const who = String(fd.get("caretaker") ?? "");
  const caretaker = who
    ? ((db.prepare("select id from member where id = ? and family_id = ? and role = 'caretaker'").get(who, me.family_id) as { id: string } | undefined)?.id ?? null)
    : null;
  const date = /^\d{4}-\d{2}-\d{2}$/.test(String(fd.get("date"))) ? String(fd.get("date")) : new Date().toISOString().slice(0, 10);
  const amount = amountOf(fd);
  const photo = await savePhoto(fd);
  db.prepare(
    "insert into record (id, family_id, caretaker_id, kind, amount, note, photo, date, shared, created_by, created_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
  ).run(newId(), me.family_id, caretaker, kind, amount, text(fd, "note"), photo, date, fd.get("shared") ? 1 : 0, me.id, Date.now());
  done("/more");
}

export async function toggleShare(recordId: string) {
  const { me } = await requireAdmin();
  db.prepare("update record set shared = 1 - shared where id = ? and family_id = ?").run(recordId, me.family_id);
  done();
}

export async function deleteRecord(recordId: string) {
  const { me } = await requireAdmin();
  const row = db.prepare("select photo from record where id = ? and family_id = ?").get(recordId, me.family_id) as
    | { photo: string | null }
    | undefined;
  if (!row) return;
  db.prepare("delete from record where id = ?").run(recordId);
  removePhoto(row.photo);
  done();
}

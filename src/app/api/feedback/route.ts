import crypto from "node:crypto";
import { db } from "@/lib/db";
import { readPhoto, imageType } from "@/lib/photos";
import { updateFeedback, type Feedback } from "@/lib/feedback";

/**
 * For the app's owners and their tools (scripts/feedback.mjs): read feedback and answer it.
 * Needs `Authorization: Bearer <FEEDBACK_TOKEN>`; off when that secret is not set.
 *   GET  /api/feedback?status=new        list (status optional; "open" = new, planned, doing)
 *   GET  /api/feedback?photo=<name>      a feedback screenshot
 *   POST /api/feedback {id, status, reply}
 */
function allowed(req: Request) {
  const want = process.env.FEEDBACK_TOKEN;
  if (!want || want.length < 32) return false;
  const got = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const a = Buffer.from(got);
  const b = Buffer.from(want);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function GET(req: Request) {
  if (!allowed(req)) return new Response("Unauthorized", { status: 401 });
  const url = new URL(req.url);
  const photo = url.searchParams.get("photo");
  if (photo) {
    if (!/^[0-9a-f-]{36}\.jpg$/.test(photo) || !db.prepare("select 1 from feedback where photo = ?").get(photo)) return new Response("Not found", { status: 404 });
    const buf = await readPhoto(photo);
    const type = buf && imageType(buf);
    if (!buf || !type) return new Response("Not found", { status: 404 });
    return new Response(buf, { headers: { "Content-Type": type, "X-Content-Type-Options": "nosniff" } });
  }
  const status = url.searchParams.get("status");
  const where = status === "open" ? "where status in ('new','planned','doing')" : status ? "where status = @status" : "";
  const rows = db
    .prepare(`select id, name, body, photo, status, reply, created_at, updated_at from feedback ${where} order by created_at desc limit 500`)
    .all(status && status !== "open" ? { status } : {}) as Omit<Feedback, "user_id" | "family_id">[];
  return Response.json(rows.map((r) => ({ ...r, created: new Date(r.created_at).toISOString(), updated: new Date(r.updated_at).toISOString() })));
}

export async function POST(req: Request) {
  if (!allowed(req)) return new Response("Unauthorized", { status: 401 });
  const b = (await req.json().catch(() => null)) as { id?: string; status?: string; reply?: string | null } | null;
  if (!b?.id || !b.status) return new Response("Need id and status", { status: 400 });
  try {
    return updateFeedback(b.id, b.status, b.reply ?? null) ? Response.json({ ok: true }) : new Response("Not found", { status: 404 });
  } catch (e) {
    return new Response(String((e as Error).message), { status: 400 });
  }
}

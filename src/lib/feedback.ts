import "server-only";
import { db } from "./db";
import { deliver } from "./notify";
import { translate, type Lang } from "./i18n";

export const FEEDBACK_STATUSES = ["new", "planned", "doing", "done", "declined"] as const;
export type FeedbackStatus = (typeof FEEDBACK_STATUSES)[number];
export type Feedback = { id: string; user_id: string; family_id: string | null; name: string | null; body: string; photo: string | null; status: FeedbackStatus; reply: string | null; created_at: number; updated_at: number };

const ownerEmails = () => (process.env.OWNER_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);

/** Account ids of the app's owners (OWNER_EMAILS). */
export function ownerUserIds() {
  const list = ownerEmails();
  if (!list.length) return [];
  return (db.prepare(`select id from user where lower(email) in (${list.map(() => "?").join(",")})`).all(...list) as { id: string }[]).map((r) => r.id);
}

/** Sets a status and reply. The sender gets a push when either changed. Returns false when there is no such feedback. */
export function updateFeedback(id: string, status: string, reply: string | null) {
  if (!(FEEDBACK_STATUSES as readonly string[]).includes(status)) throw new Error("Bad status");
  const before = db.prepare("select user_id, status, reply from feedback where id = ?").get(id) as { user_id: string; status: string; reply: string | null } | undefined;
  if (!before) return false;
  const r = reply?.trim() ? reply.trim().slice(0, 4000) : null;
  db.prepare("update feedback set status = ?, reply = ?, updated_at = ? where id = ?").run(status, r, Date.now(), id);
  if (before.status !== status || r !== (before.reply ?? null)) {
    deliver(before.user_id, "/feedback", (lang: Lang) => translate(lang, "pushFeedback", { status: translate(lang, `fb_${status}` as never) }));
  }
  return true;
}

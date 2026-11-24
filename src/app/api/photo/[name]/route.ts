import fs from "node:fs";
import path from "node:path";
import { db, UPLOAD_DIR } from "@/lib/db";
import { getUser } from "@/lib/ctx";

/** Serves a receipt photo only to members allowed to see the row it belongs to. */
export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!/^[0-9a-f-]{36}\.jpg$/.test(name)) return new Response("Not found", { status: 404 });
  const user = await getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const viaExpense = db
    .prepare(
      `select 1 from expense e join member m on m.family_id = e.family_id
       where e.photo = ? and m.user_id = ? and m.active = 1
         and (m.role = 'admin' or m.id = e.member_id)`,
    )
    .get(name, user.id);
  const viaRecord = viaExpense
    ? null
    : db
        .prepare(
          `select 1 from record r join member m on m.family_id = r.family_id
           where r.photo = ? and m.user_id = ? and m.active = 1
             and (m.role = 'admin' or (r.shared = 1 and (r.caretaker_id is null or r.caretaker_id = m.id)))`,
        )
        .get(name, user.id);
  if (!viaExpense && !viaRecord) return new Response("Not found", { status: 404 });

  try {
    const buf = await fs.promises.readFile(path.join(UPLOAD_DIR, name));
    return new Response(new Uint8Array(buf), {
      headers: { "Content-Type": "image/jpeg", "Cache-Control": "private, max-age=86400" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

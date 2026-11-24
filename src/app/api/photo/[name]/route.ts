import { db } from "@/lib/db";
import { imageType, readPhoto } from "@/lib/photos";
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
  // Photos replaced or deleted stay visible in the change history to whoever may see that history
  const viaHistory =
    viaExpense || viaRecord
      ? null
      : db
          .prepare(
            `select 1 from audit a join member m on m.family_id = a.family_id
             where (a.before like @pat or a.after like @pat) and m.user_id = @user and m.active = 1
               and (m.role = 'admin' or a.subject_id = m.id)`,
          )
          .get({ pat: `%"${name}"%`, user: user.id });
  if (!viaExpense && !viaRecord && !viaHistory) return new Response("Not found", { status: 404 });

  const buf = await readPhoto(name);
  // Only real images are served, with their real type; nosniff and a locked-down CSP stop a browser from running it as anything else
  const type = buf && imageType(buf);
  if (!buf || !type) return new Response("Not found", { status: 404 });
  return new Response(buf, {
    headers: {
      "Content-Type": type,
      "Cache-Control": "private, max-age=86400",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  });
}

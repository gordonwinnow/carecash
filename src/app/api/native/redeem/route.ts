import { db } from "@/lib/db";

const safe = (v: string | null) => (v && v.startsWith("/") && !v.startsWith("//") ? v : "/home");

/** Runs inside the iOS app: trades the one-time code for the session cookies made in Safari. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code") ?? "";
  const row = db.prepare("select cookies from native_code where code = ? and expires_at > ?").get(code, Date.now()) as { cookies: string } | undefined;
  db.prepare("delete from native_code where code = ?").run(code);
  const headers = new Headers({ Location: row ? safe(url.searchParams.get("next")) : "/sign-in" });
  if (row) {
    const secure = url.protocol === "https:" ? "; Secure" : "";
    for (const c of JSON.parse(row.cookies) as string[]) {
      headers.append("Set-Cookie", `${c}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${180 * 86400}${secure}`);
    }
  }
  return new Response(null, { status: 302, headers });
}

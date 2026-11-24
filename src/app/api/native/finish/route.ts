import crypto from "node:crypto";
import { db } from "@/lib/db";

const safe = (v: string | null) => (v && v.startsWith("/") && !v.startsWith("//") ? v : "/home");
const SESSION_COOKIE = /^(__Secure-)?better-auth\.session_/;

/** Runs in Safari after sign-in: keeps the session cookies under a one-time code and opens the app with it. */
export async function GET(req: Request) {
  const cookies = (req.headers.get("cookie") ?? "")
    .split(/;\s*/)
    .filter((c) => SESSION_COOKIE.test(c.split("=")[0]));
  if (cookies.length === 0) return new Response("Sign-in did not finish. Please close this and try again.", { status: 400 });
  const code = crypto.randomBytes(32).toString("base64url");
  db.prepare("delete from native_code where expires_at < ?").run(Date.now());
  db.prepare("insert into native_code (code, cookies, expires_at) values (?, ?, ?)").run(code, JSON.stringify(cookies), Date.now() + 2 * 60_000);
  const next = safe(new URL(req.url).searchParams.get("next"));
  return Response.redirect(`carecash://auth?code=${code}&next=${encodeURIComponent(next)}`, 302);
}

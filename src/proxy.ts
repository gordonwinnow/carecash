import { NextResponse, type NextRequest } from "next/server";

/**
 * One address for the app: requests to the old Fly address go to the main one (BETTER_AUTH_URL), path and query kept.
 * Only the old public name is redirected, so Fly's health checks (which use the machine's own address) are untouched.
 */
const OLD_HOSTS = ["carecash.fly.dev"];

export function proxy(req: NextRequest) {
  const main = process.env.BETTER_AUTH_URL;
  const host = (req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "").toLowerCase();
  if (!main || !OLD_HOSTS.includes(host)) return NextResponse.next();
  const target = new URL(main);
  if (target.host === host) return NextResponse.next();
  return NextResponse.redirect(new URL(req.nextUrl.pathname + req.nextUrl.search, target), 308);
}

export const config = {
  matcher: "/:path*",
};

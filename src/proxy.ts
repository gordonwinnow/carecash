import { NextResponse, type NextRequest } from "next/server";

/**
 * First-touch attribution: a visit with ?ref=<code> (a broker, a post, a flyer) or ?utm_source=<x>
 * keeps that code in a cookie for 90 days. When the visitor later creates a family, it is saved on the family
 * (family.source), so the metrics can say which channel brought which households.
 */
export function proxy(req: NextRequest) {
  const res = NextResponse.next();
  if (req.cookies.get("cc_ref")) return res;
  const p = req.nextUrl.searchParams;
  const raw = (p.get("ref") || p.get("utm_source") || "").trim().toLowerCase();
  const campaign = (p.get("utm_campaign") || "").trim().toLowerCase();
  const ref = [raw, campaign].filter(Boolean).join(":");
  if (raw && /^[a-z0-9_:.-]{1,60}$/.test(ref)) {
    res.cookies.set("cc_ref", ref, { maxAge: 90 * 24 * 3600, path: "/", sameSite: "lax", httpOnly: true, secure: req.nextUrl.protocol === "https:" });
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/|api/|.*\\.(?:png|jpg|svg|ico|js|webmanifest)$).*)"],
};

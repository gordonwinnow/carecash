import { NextResponse, type NextRequest } from "next/server";
import { isNativeApp } from "@/lib/native";

const OLD_HOST = "carecash.fly.dev";

/**
 * The iPhone app opens carecash.fly.dev inside a web view that cannot leave that address,
 * so it must not be redirected. Its web view's user agent has no "Safari/" token, unlike Safari and other browsers.
 * In-app browsers of Facebook, Instagram and LINE are redirected like any browser.
 */

/**
 * First-touch attribution: a visit with ?ref=<code> (a broker, a post, a flyer) or ?utm_source=<x>
 * keeps that code in a cookie for 90 days. When the visitor later creates a family, it is saved on the family
 * (family.source), so the metrics can say which channel brought which households.
 */
export function proxy(req: NextRequest) {
  // Once SITE_URL is set (the custom domain works), web visitors on the old address move there, keeping the path and ?ref=
  const site = process.env.SITE_URL;
  const host = req.headers.get("host")?.split(":")[0];
  // www.carecash.me → carecash.me, so there is one address (and one sign-in) for everyone
  if (site && host === `www.${new URL(site).host}`) {
    return NextResponse.redirect(new URL(req.nextUrl.pathname + req.nextUrl.search, site), 308);
  }
  if (site && host === OLD_HOST && new URL(site).host !== OLD_HOST && !isNativeApp(req.headers.get("user-agent") ?? "")) {
    const to = new URL(req.nextUrl.pathname + req.nextUrl.search, site);
    return NextResponse.redirect(to, 308);
  }
  const res = NextResponse.next();
  const lang = req.nextUrl.searchParams.get("lang");
  if (lang && /^(zh-TW|en|id|vi|tl|th|ja|ko|es|fr)$/.test(lang)) {
    res.cookies.set("lang", lang, { maxAge: 365 * 24 * 3600, path: "/", sameSite: "lax" });
  }
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

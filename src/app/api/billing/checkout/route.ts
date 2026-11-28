import { headers } from "next/headers";
import { db } from "@/lib/db";
import { getCtx } from "@/lib/ctx";
import { billingProvider, PRICE_YEAR } from "@/lib/billing";
import { isNativeApp } from "@/lib/native";
import { SITE_URL } from "@/lib/site";
import * as ecpay from "@/lib/ecpay";
import * as stripe from "@/lib/stripe";

const ITEM = "CareCash 一年方案";
const see = (to: string) => new Response(null, { status: 303, headers: { location: to } });
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** Where browsers come back to: this server when testing locally, else the public address. */
async function siteOf() {
  const host = (await headers()).get("host") ?? "";
  return /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host) ? `http://${host}` : SITE_URL;
}

/**
 * The employer pressed Pay on the plan page (a form POST, so it can't be triggered by a link or a prefetch).
 * ECPay: an auto-submitting form to its checkout. Stripe: a redirect to its Checkout page.
 * Never offered in the iPhone app (Apple doesn't allow paying outside it there).
 */
export async function POST(req: Request) {
  const { user, me } = await getCtx();
  if (!user || !me) return see("/sign-in");
  const provider = billingProvider();
  const ua = (await headers()).get("user-agent") ?? "";
  if (!provider || me.role !== "admin" || me.demo || isNativeApp(ua)) return see("/plan");
  const fd = await req.formData();
  const realEmail = user.email && !user.email.endsWith(".carecash.local") ? user.email : null;
  const email = String(fd.get("email") ?? "").trim().slice(0, 100) || realEmail;
  const site = await siteOf();

  if (provider === "stripe") {
    const customer = (db.prepare("select plan_customer from family where id = ?").get(me.family_id) as { plan_customer: string | null }).plan_customer;
    const url = await stripe.yearlyCheckout({ familyId: me.family_id, amount: PRICE_YEAR, item: ITEM, email: email ?? "", customer, site });
    return see(url);
  }

  const tradeNo = ecpay.tradeNo();
  db.prepare("insert into checkout (ref, family_id, member_id, email, created_at) values (?, ?, ?, ?, ?)").run(tradeNo, me.family_id, me.id, email, Date.now());
  const form = ecpay.yearlyCheckout({ familyId: me.family_id, tradeNo, amount: PRICE_YEAR, item: ITEM, site, notifySite: SITE_URL });
  const inputs = Object.entries(form.fields)
    .map(([k, v]) => `<input type="hidden" name="${esc(k)}" value="${esc(v)}">`)
    .join("");
  return new Response(
    `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>CareCash</title>
<body style="font:18px system-ui;text-align:center;padding:40px">前往綠界付款…
<form id="f" method="post" action="${esc(form.action)}">${inputs}<noscript><button>繼續</button></noscript></form>
<script>document.getElementById("f").submit()</script>`,
    { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } },
  );
}

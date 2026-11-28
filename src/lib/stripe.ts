import "server-only";
import crypto from "node:crypto";

/**
 * Stripe: yearly subscription through Stripe Checkout, managed (card, cancel) in Stripe's customer portal.
 * Keys (Fly secrets): STRIPE_SECRET_KEY (sk_test_… to try it, sk_live_… for real) and STRIPE_WEBHOOK_SECRET (whsec_…).
 * Called with plain fetch, so there is no SDK to keep up to date.
 */
async function stripe<T>(path: string, params: Record<string, string>) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Stripe ${path}: ${body?.error?.message ?? res.status}`);
  return body as T;
}

/** A Checkout page for the yearly plan, in Taiwan dollars. Returns the URL to send the employer to. */
export async function yearlyCheckout(o: { familyId: string; amount: number; item: string; email: string; customer?: string | null; site: string }) {
  const s = await stripe<{ url: string }>("checkout/sessions", {
    mode: "subscription",
    client_reference_id: o.familyId,
    "metadata[family_id]": o.familyId,
    "subscription_data[metadata][family_id]": o.familyId,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "twd",
    // TWD has two decimals in Stripe's API: NT$990 is 99000
    "line_items[0][price_data][unit_amount]": String(o.amount * 100),
    "line_items[0][price_data][recurring][interval]": "year",
    "line_items[0][price_data][product_data][name]": o.item,
    locale: "zh-TW",
    success_url: `${o.site}/plan?paid=1`,
    cancel_url: `${o.site}/plan`,
    ...(o.customer ? { customer: o.customer } : { customer_email: o.email }),
  });
  return s.url;
}

/** Stripe's own page where the employer changes the card or cancels. */
export async function portal(customer: string, site: string) {
  const s = await stripe<{ url: string }>("billing_portal/sessions", { customer, return_url: `${site}/plan`, locale: "zh-TW" });
  return s.url;
}

/** Checks the Stripe-Signature header (HMAC-SHA256 of "timestamp.body"), allowing 5 minutes of clock difference. */
export function verifyWebhook(body: string, header: string | null) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !header) return false;
  const parts = header.split(",").map((p) => p.split("=") as [string, string]);
  const t = parts.find(([k]) => k === "t")?.[1];
  if (!t || Math.abs(Date.now() / 1000 - Number(t)) > 300) return false;
  const want = Buffer.from(crypto.createHmac("sha256", secret).update(`${t}.${body}`).digest("hex"));
  return parts.some(([k, v]) => k === "v1" && v?.length === want.length && crypto.timingSafeEqual(Buffer.from(v), want));
}

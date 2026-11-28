import { db } from "@/lib/db";
import { familyByPlanRef, markCanceled, recordPayment } from "@/lib/billing";
import { verifyWebhook } from "@/lib/stripe";

type Meta = { family_id?: string } | null | undefined;
type Invoice = {
  id: string;
  amount_paid: number;
  customer: string;
  subscription?: string | null;
  subscription_details?: { metadata?: Meta } | null;
  parent?: { subscription_details?: { subscription?: string; metadata?: Meta } | null } | null;
  lines: { data: { period: { end: number } }[] };
};

/**
 * Stripe's webhook. Subscribe it to checkout.session.completed, invoice.paid, customer.subscription.updated and
 * customer.subscription.deleted, at https://carecash.me/api/billing/stripe.
 */
export async function POST(req: Request) {
  const body = await req.text();
  if (!verifyWebhook(body, req.headers.get("stripe-signature"))) return new Response("Bad signature", { status: 400 });
  const ev = JSON.parse(body) as { type: string; data: { object: Record<string, unknown> } };
  const o = ev.data.object;

  if (ev.type === "checkout.session.completed" && o.mode === "subscription") {
    const fid = (o.metadata as Meta)?.family_id ?? (o.client_reference_id as string | null);
    if (fid) db.prepare("update family set plan_ref = ?, plan_customer = ?, plan_provider = 'stripe' where id = ?").run(o.subscription, o.customer, fid);
  }

  if (ev.type === "invoice.paid") {
    const inv = o as unknown as Invoice;
    // Newer API versions put the subscription under parent.subscription_details
    const sub = inv.parent?.subscription_details?.subscription ?? inv.subscription ?? null;
    const meta = inv.parent?.subscription_details?.metadata ?? inv.subscription_details?.metadata;
    const fid = meta?.family_id ?? (sub ? familyByPlanRef(sub) : null);
    const end = Math.max(0, ...inv.lines.data.map((l) => l.period.end)) * 1000;
    if (fid && sub && end) {
      recordPayment({ familyId: fid, provider: "stripe", ref: inv.id, amount: Math.round(inv.amount_paid / 100), periodEnd: () => end, subscription: sub, customer: inv.customer });
    }
  }

  if (ev.type === "customer.subscription.updated" || ev.type === "customer.subscription.deleted") {
    const fid = (o.metadata as Meta)?.family_id ?? familyByPlanRef(o.id as string);
    if (fid) {
      const stops = ev.type === "customer.subscription.deleted" || o.cancel_at_period_end === true || o.status === "canceled";
      if (stops) markCanceled(fid);
      else db.prepare("update family set plan_status = 'active' where id = ? and paid_until is not null").run(fid);
    }
  }

  return Response.json({ received: true });
}

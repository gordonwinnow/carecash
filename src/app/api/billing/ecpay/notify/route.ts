import { after } from "next/server";
import { db } from "@/lib/db";
import { familyByPlanRef, PRICE_YEAR, recordPayment, yearFrom } from "@/lib/billing";
import { issueInvoice, verifyNotify } from "@/lib/ecpay";

/**
 * ECPay tells the server about each charge here: the first year (ReturnURL) and every yearly renewal (PeriodReturnURL).
 * It must answer "1|OK", or ECPay sends it again.
 */
export async function POST(req: Request) {
  const f = Object.fromEntries(new URLSearchParams(await req.text())) as Record<string, string>;
  if (!verifyNotify(f)) return new Response("0|CheckMacValue", { status: 400 });
  if (f.RtnCode !== "1") return new Response("1|OK"); // a failed renewal: the plan just runs out after its grace days

  const tradeNo = f.MerchantTradeNo;
  const familyId = f.CustomField1 || familyByPlanRef(tradeNo);
  if (!familyId) return new Response("1|OK");
  const amount = Number(f.Amount || f.TradeAmt || PRICE_YEAR);
  // Each charge of the same order: 1 (the first year), 2, 3, … so a resent notification counts once
  const ref = `${tradeNo}-${f.TotalSuccessTimes || "1"}`;
  const pay = recordPayment({ familyId, provider: "ecpay", ref, amount, periodEnd: yearFrom, subscription: tradeNo });
  if (pay?.fresh) after(() => invoiceFor(pay.id, ref, tradeNo, familyId, amount));
  return new Response("1|OK");
}

/** Issues the 統一發票 for a payment and keeps its number (or why it failed, to fix by hand). */
async function invoiceFor(paymentId: string, ref: string, tradeNo: string, familyId: string, amount: number) {
  const fam = db.prepare("select carrier from family where id = ?").get(familyId) as { carrier: string | null };
  const who = db
    .prepare("select c.email, m.name from checkout c left join member m on m.id = c.member_id where c.ref = ?")
    .get(tradeNo) as { email: string | null; name: string | null } | undefined;
  const base = { ref, amount, item: "CareCash 一年方案", email: who?.email ?? "", name: who?.name };
  try {
    let r = await issueInvoice({ ...base, carrier: fam?.carrier });
    // A barcode ECPay doesn't accept: fall back to the emailed invoice
    if (!r.ok && fam?.carrier && base.email) r = await issueInvoice({ ...base, carrier: null });
    db.prepare("update payment set invoice_no = ?, invoice_error = ? where id = ?").run(r.ok ? r.invoiceNo : null, r.ok ? null : r.error, paymentId);
  } catch (e) {
    db.prepare("update payment set invoice_error = ? where id = ?").run(String(e).slice(0, 300), paymentId);
  }
}

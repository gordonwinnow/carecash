import "server-only";
import crypto from "node:crypto";
import { TZ } from "./format";

/**
 * ECPay (綠界): yearly card billing (信用卡定期定額) and B2C e-invoices (電子發票), for a Taiwan business.
 *
 * Keys (Fly secrets): ECPAY_MERCHANT_ID, ECPAY_HASH_KEY, ECPAY_HASH_IV for payments, and ECPAY_INVOICE_MERCHANT_ID,
 * ECPAY_INVOICE_HASH_KEY, ECPAY_INVOICE_HASH_IV for e-invoices. Until ECPAY_ENV=prod, everything goes to ECPay's
 * test system with its public test merchants, so the whole flow can be tried without an account.
 */
const PROD = process.env.ECPAY_ENV === "prod";

// ECPay's published test merchants (not secrets)
const TEST_PAY = { id: "3002607", key: "pwFHCqoQZGmho4w6", iv: "EkRm7iFT261dpevs" };
const TEST_INVOICE = { id: "2000132", key: "ejCk326UnaZWKisg", iv: "q9jcZX8Ib9LM8wYk" };

function payKeys() {
  if (!PROD) return TEST_PAY;
  const { ECPAY_MERCHANT_ID: id, ECPAY_HASH_KEY: key, ECPAY_HASH_IV: iv } = process.env;
  if (!id || !key || !iv) throw new Error("ECPay keys are not set");
  return { id, key, iv };
}

function invoiceKeys() {
  if (!PROD) return TEST_INVOICE;
  const { ECPAY_INVOICE_MERCHANT_ID: id, ECPAY_INVOICE_HASH_KEY: key, ECPAY_INVOICE_HASH_IV: iv } = process.env;
  return id && key && iv ? { id, key, iv } : null;
}

const PAY_HOST = PROD ? "https://payment.ecpay.com.tw" : "https://payment-stage.ecpay.com.tw";
const INVOICE_HOST = PROD ? "https://einvoice.ecpay.com.tw" : "https://einvoice-stage.ecpay.com.tw";

/** URL-encoding the way ECPay's .NET servers do it (spaces as +, lowercase). */
function dotnetEncode(s: string) {
  return encodeURIComponent(s).replace(/%20/g, "+").replace(/'/g, "%27").replace(/~/g, "%7e").toLowerCase();
}

/** CheckMacValue: the fields sorted by name, wrapped in HashKey/HashIV, encoded, SHA-256, uppercase. */
export function checkMac(fields: Record<string, string>, keys = payKeys()) {
  const body = Object.keys(fields)
    .filter((k) => k !== "CheckMacValue")
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .map((k) => `${k}=${fields[k]}`)
    .join("&");
  const raw = `HashKey=${keys.key}&${body}&HashIV=${keys.iv}`;
  return crypto.createHash("sha256").update(dotnetEncode(raw)).digest("hex").toUpperCase();
}

/** Whether a notification from ECPay really came from ECPay (and, in production, isn't a test "simulated" payment). */
export function verifyNotify(fields: Record<string, string>) {
  const given = fields.CheckMacValue ?? "";
  const want = checkMac(fields);
  const ok = given.length === want.length && crypto.timingSafeEqual(Buffer.from(given), Buffer.from(want));
  return ok && !(PROD && fields.SimulatePaid === "1");
}

/** A new order number: up to 20 letters and digits, unique. */
export function tradeNo() {
  return `CC${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(4).toString("hex").toUpperCase()}`.slice(0, 20);
}

function tradeDate(ms = Date.now()) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" })
      .formatToParts(ms)
      .map((x) => [x.type, x.value]),
  );
  return `${p.year}/${p.month}/${p.day} ${p.hour}:${p.minute}:${p.second}`;
}

/**
 * The form that opens ECPay's checkout for a yearly plan: the first year is charged now, then once a year
 * (up to 9 times, ECPay's limit for yearly plans; the plan page asks to renew before that runs out).
 */
export function yearlyCheckout(o: { familyId: string; tradeNo: string; amount: number; item: string; site: string; notifySite: string }) {
  const k = payKeys();
  const fields: Record<string, string> = {
    MerchantID: k.id,
    MerchantTradeNo: o.tradeNo,
    MerchantTradeDate: tradeDate(),
    PaymentType: "aio",
    TotalAmount: String(o.amount),
    TradeDesc: "CareCash",
    ItemName: o.item,
    // ECPay's servers call the public address; the browser comes back to `site` (which is localhost when testing)
    ReturnURL: `${o.notifySite}/api/billing/ecpay/notify`,
    PeriodReturnURL: `${o.notifySite}/api/billing/ecpay/notify`,
    OrderResultURL: `${o.site}/api/billing/ecpay/result`,
    ClientBackURL: `${o.site}/plan`,
    ChoosePayment: "Credit",
    EncryptType: "1",
    PeriodAmount: String(o.amount),
    PeriodType: "Y",
    Frequency: "1",
    ExecTimes: "9",
    CustomField1: o.familyId,
    NeedExtraPaidInfo: "N",
  };
  fields.CheckMacValue = checkMac(fields, k);
  return { action: `${PAY_HOST}/Cashier/AioCheckOut/V5`, fields };
}

/** Stops the yearly charges. Paid time already bought still counts. */
export async function cancelYearly(merchantTradeNo: string) {
  const k = payKeys();
  const fields: Record<string, string> = { MerchantID: k.id, MerchantTradeNo: merchantTradeNo, Action: "Cancel", TimeStamp: String(Math.floor(Date.now() / 1000)) };
  fields.CheckMacValue = checkMac(fields, k);
  const res = await fetch(`${PAY_HOST}/Cashier/CreditCardPeriodAction`, { method: "POST", body: new URLSearchParams(fields) });
  const out = Object.fromEntries(new URLSearchParams(await res.text()));
  return out.RtnCode === "1";
}

// ---------- E-invoices (B2C) ----------

function aes(keys: { key: string; iv: string }) {
  return {
    encrypt(data: unknown) {
      const c = crypto.createCipheriv("aes-128-cbc", Buffer.from(keys.key), Buffer.from(keys.iv));
      return Buffer.concat([c.update(encodeURIComponent(JSON.stringify(data)), "utf8"), c.final()]).toString("base64");
    },
    decrypt(b64: string) {
      const d = crypto.createDecipheriv("aes-128-cbc", Buffer.from(keys.key), Buffer.from(keys.iv));
      return JSON.parse(decodeURIComponent(Buffer.concat([d.update(Buffer.from(b64, "base64")), d.final()]).toString("utf8")));
    },
  };
}

/**
 * Issues the 統一發票 for one payment. It goes to the family's own mobile barcode (載具) when the family has one,
 * else to an ECPay member carrier tied to the payer's email (the invoice is emailed). Returns the invoice number.
 */
export async function issueInvoice(o: { ref: string; amount: number; item: string; email: string; name?: string | null; carrier?: string | null }) {
  const k = invoiceKeys();
  if (!k) return { ok: false as const, error: "E-invoice keys are not set" };
  const data = {
    MerchantID: k.id,
    RelateNumber: o.ref.slice(0, 30),
    CustomerName: o.name?.slice(0, 60) ?? "",
    CustomerEmail: o.email,
    Print: "0",
    Donation: "0",
    CarrierType: o.carrier ? "3" : "1",
    CarrierNum: o.carrier ?? "",
    TaxType: "1",
    SalesAmount: o.amount,
    InvType: "07",
    vat: "1",
    Items: [{ ItemSeq: 1, ItemName: o.item, ItemCount: 1, ItemWord: "年", ItemPrice: o.amount, ItemTaxType: "1", ItemAmount: o.amount }],
  };
  const c = aes(k);
  const res = await fetch(`${INVOICE_HOST}/B2CInvoice/Issue`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ MerchantID: k.id, RqHeader: { Timestamp: Math.floor(Date.now() / 1000) }, Data: c.encrypt(data) }),
  });
  const body = (await res.json()) as { TransCode: number; TransMsg: string; Data?: string };
  if (body.TransCode !== 1 || !body.Data) return { ok: false as const, error: `${body.TransCode} ${body.TransMsg}` };
  const out = c.decrypt(body.Data) as { RtnCode: number; RtnMsg: string; InvoiceNo?: string };
  return out.RtnCode === 1 && out.InvoiceNo ? { ok: true as const, invoiceNo: out.InvoiceNo } : { ok: false as const, error: `${out.RtnCode} ${out.RtnMsg}` };
}

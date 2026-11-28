import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Check, CircleAlert, Crown } from "lucide-react";
import { db } from "@/lib/db";
import { getLang, getT, requireCtx } from "@/lib/ctx";
import { PRICE_YEAR, billingProvider, planOf } from "@/lib/billing";
import { isNativeApp } from "@/lib/native";
import { TZ } from "@/lib/format";
import { managePlan } from "../../actions";
import { ActionButton, BackHeader } from "@/components/ui";

/**
 * The family's plan. Employers on the web see the price and pay here; caretakers see the status and,
 * when the free entries run out, who to ask. The iPhone app shows the status only (Apple doesn't allow
 * pointing to payment outside the app).
 */
export default async function PlanPage({ searchParams }: { searchParams: Promise<{ paid?: string; failed?: string; over?: string; next?: string }> }) {
  const { user, me } = await requireCtx();
  const sp = await searchParams;
  const provider = billingProvider();
  if (!provider) redirect("/settings");
  const t = await getT();
  const lang = await getLang();
  const plan = planOf(me.family_id);
  const native = isNativeApp((await headers()).get("user-agent") ?? "");
  const isAdmin = me.role === "admin";
  const canPay = isAdmin && !native && !me.demo && plan.kind !== "paid";
  const date = (ms: number) => new Date(ms).toLocaleDateString(lang, { timeZone: TZ, year: "numeric", month: "long", day: "numeric" });
  const fam = db.prepare("select carrier from family where id = ?").get(me.family_id) as { carrier: string | null };
  // Where "Continue for now" goes: back to where the entry was added (a path on this site only)
  const next = sp.next?.startsWith("/") && !sp.next.startsWith("//") ? sp.next : "/home";
  const realEmail = user.email && !user.email.endsWith(".carecash.local") ? user.email : "";

  const status =
    plan.kind === "paid"
      ? t(plan.renews ? "planPaid" : "planEnds", { date: date(plan.until) })
      : plan.kind === "trial"
        ? t("planTrial", { n: plan.daysLeft })
        : plan.kind === "free"
          ? t("planFree")
          : "";

  return (
    <div className="space-y-5">
      <BackHeader title={t("plan")} href={isAdmin ? "/settings" : "/home"} />

      {sp.paid && <p className="flex items-center gap-2 rounded-2xl bg-good-soft p-4 text-base font-semibold"><Check size={20} /> {t("planThanks")}</p>}
      {sp.failed && <p className="flex items-center gap-2 rounded-2xl bg-warn-soft p-4 text-base font-semibold"><CircleAlert size={20} /> {t("planFailed")}</p>}

      {status && (
        <section className="card flex items-center gap-3">
          <span className="badge h-10 w-10 rounded-full"><Crown size={20} /></span>
          <span className="text-lg font-semibold">{status}</span>
        </section>
      )}

      {/* An employer past the free entries, sent here after adding one (it was saved): why, and a way to carry on */}
      {isAdmin && plan.kind === "free" && plan.used > plan.limit && (
        <p className="rounded-2xl bg-accent-soft p-4 text-base font-semibold">{t("planOver", { used: plan.used, limit: plan.limit })}</p>
      )}

      {canPay && (
        <section className="card space-y-4">
          <div>
            <div className="tabular text-3xl font-extrabold">{t("planYear", { price: PRICE_YEAR.toLocaleString("en-US") })}</div>
            <div className="text-base text-muted">{t("planPerMonth")}</div>
          </div>
          <ul className="space-y-2 text-base">
            <li className="flex gap-2"><Check size={20} className="mt-0.5 shrink-0 text-accent" /> {t("planWhat")}</li>
            <li className="flex gap-2"><Check size={20} className="mt-0.5 shrink-0 text-accent" /> {t("planRenews")}</li>
          </ul>
          <form method="post" action="/api/billing/checkout" className="space-y-3">
            {/* ECPay issues a 統一發票: into the family's barcode if it has one, else by email */}
            {provider === "ecpay" &&
              (fam.carrier ? (
                <p className="text-base text-muted">{t("planInvoiceCarrier", { code: fam.carrier })}</p>
              ) : (
                <div>
                  <label className="label" htmlFor="email">{t("planInvoiceEmail")}</label>
                  <input id="email" name="email" type="email" defaultValue={realEmail} required className="field" maxLength={100} />
                </div>
              ))}
            <button className="btn-primary">{t("planPay")}</button>
          </form>
        </section>
      )}

      {sp.over && (
        <Link href={next} className="flex w-full items-center justify-center py-1 text-base font-semibold text-muted">
          {t("planContinue")}
        </Link>
      )}

      {/* ECPay: stop renewing here. Stripe: its own page (change card, cancel, or resume a cancelled plan) */}
      {isAdmin && !native && plan.kind === "paid" && (plan.renews || provider === "stripe") && (
        <ActionButton action={managePlan} confirm={provider === "ecpay" ? `${t("planCancel")}?` : undefined} className="flex w-full items-center justify-center py-1 text-base font-semibold text-muted">
          {provider === "stripe" ? t("planManage") : t("planCancel")}
        </ActionButton>
      )}
    </div>
  );
}

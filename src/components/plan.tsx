import Link from "next/link";
import { headers } from "next/headers";
import { Crown } from "lucide-react";
import { canAdd, planOf } from "@/lib/billing";
import { isNativeApp } from "@/lib/native";
import type { T } from "@/lib/i18n";

/**
 * Shown instead of an add form once an unpaid family has used its free entries this month,
 * so nobody types (or photographs) an entry that can't be saved.
 */
export async function LimitNotice({ familyId, role, t }: { familyId: string; role: string; t: T }) {
  if (canAdd(familyId)) return null;
  const p = planOf(familyId);
  const limit = p.kind === "free" ? p.limit : 0;
  const native = isNativeApp((await headers()).get("user-agent") ?? "");
  return (
    <div className="space-y-4 rounded-3xl bg-warn-soft p-5 text-base font-semibold">
      <p>{t("planFull", { limit })} {role !== "admin" && t("planAskEmployer")}</p>
      {role === "admin" && !native && (
        <Link href="/plan" className="btn-primary"><Crown size={20} /> {t("upgrade")}</Link>
      )}
    </div>
  );
}

/**
 * A quiet reminder on an employer's home: the last week of the trial, or the free plan's entries running low.
 * Never in the iPhone app.
 */
export async function PlanBanner({ familyId, t }: { familyId: string; t: T }) {
  const p = planOf(familyId);
  const show = (p.kind === "trial" && p.daysLeft <= 7) || (p.kind === "free" && p.left <= 10);
  if (!show || isNativeApp((await headers()).get("user-agent") ?? "")) return null;
  const text = p.kind === "trial" ? t("planTrial", { n: p.daysLeft }) : p.kind === "free" ? t("planFree", { used: p.used, limit: p.limit }) : "";
  return (
    <Link href="/plan" className="flex items-center gap-3 rounded-3xl bg-accent-soft px-4 py-3 text-base font-semibold">
      <Crown size={20} className="shrink-0 text-accent" />
      <span className="flex-1">{text}</span>
      <span className="text-accent">{t("upgrade")}</span>
    </Link>
  );
}

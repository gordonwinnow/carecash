import Link from "next/link";
import { db } from "@/lib/db";
import { getT, requireLabs } from "@/lib/ctx";
import { today } from "@/lib/format";
import { isMonth, isSlipLang, type Slip, type SlipLang } from "@/lib/labs";
import { BackHeader } from "@/components/ui";
import { LabsTag } from "@/components/labs";
import { PayslipForm } from "./form";

export default async function Payslip({ searchParams }: { searchParams: Promise<{ m?: string; month?: string; lang?: string; saved?: string }> }) {
  const sp = await searchParams;
  const { me } = await requireLabs();
  const t = await getT();
  const caretakers = db
    .prepare("select id, name from member where family_id = ? and role = 'caretaker' and active = 1 order by created_at")
    .all(me.family_id) as { id: string; name: string }[];
  const who = caretakers.find((c) => c.id === sp.m) ?? caretakers[0];
  const month = isMonth(sp.month) ? sp.month : today().slice(0, 7);

  if (!who) {
    return (
      <div className="space-y-6">
        <BackHeader title={t("labsPayslip")} href="/more" />
        <div className="card space-y-3 text-center">
          <p className="text-lg font-bold">{t("noCaretaker")}</p>
          <Link href="/settings?invite=caretaker" className="btn-tint">{t("inviteCaretaker")}</Link>
        </div>
      </div>
    );
  }

  // A slip already saved for this month wins; otherwise start from her last slip and last salary record
  const saved = db.prepare("select lang, data from payslip where member_id = ? and month = ?").get(who.id, month) as { lang: string; data: string } | undefined;
  const last = db.prepare("select lang, data from payslip where member_id = ? order by month desc limit 1").get(who.id) as { lang: string; data: string } | undefined;
  const lastSalary = db
    .prepare("select amount from record where family_id = ? and caretaker_id = ? and kind = 'salary' order by date desc, created_at desc limit 1")
    .get(me.family_id, who.id) as { amount: number } | undefined;
  const hasRecord = !!db
    .prepare("select 1 from record where family_id = ? and caretaker_id = ? and kind = 'salary' and substr(date, 1, 7) = ?")
    .get(me.family_id, who.id, month);

  const lang: SlipLang = isSlipLang(sp.lang) ? sp.lang : isSlipLang(saved?.lang) ? saved.lang : isSlipLang(last?.lang) ? last.lang : "id";
  const prev = last ? (JSON.parse(last.data) as Slip) : null;
  const initial: Slip = saved
    ? (JSON.parse(saved.data) as Slip)
    : {
        base: lastSalary?.amount ?? prev?.base ?? 20000,
        overtime: 0,
        overtimeNote: "",
        otherPay: 0,
        nhi: prev?.nhi ?? 0,
        otherDeduct: 0,
        otherDeductNote: "",
        paidDate: today(),
        method: prev?.method ?? "cash",
      };

  return (
    <div className="space-y-6">
      <div className="no-print space-y-3">
        <BackHeader title={t("labsPayslip")} href="/more" />
        <p className="flex items-start gap-2 rounded-2xl bg-warn-soft p-4 text-[15px] font-semibold">
          <span className="pt-0.5"><LabsTag /></span>
          <span>{t("labsDisclaimer")}</span>
        </p>
      </div>
      <PayslipForm
        key={`${who.id}|${month}`}
        caretakers={caretakers}
        who={who}
        month={month}
        lang={lang}
        initial={initial}
        employer={me.family_name}
        prefilled={!saved && !!lastSalary}
        hasRecord={hasRecord}
        saved={!!saved && sp.saved === "1"}
      />
    </div>
  );
}

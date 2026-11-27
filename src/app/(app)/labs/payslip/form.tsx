"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Printer } from "lucide-react";
import { translate, type Key } from "@/lib/i18n";
import { SLIP_LANGS, slipTotals, type Slip, type SlipLang } from "@/lib/labs";
import { savePayslip } from "@/app/actions";
import { Submit } from "@/components/ui";
import { useT } from "@/components/i18n";

type Props = {
  caretakers: { id: string; name: string }[];
  who: { id: string; name: string };
  month: string;
  lang: SlipLang;
  initial: Slip;
  employer: string;
  prefilled: boolean;
  hasRecord: boolean;
  saved: boolean;
};

const nt = (n: number) => `NT$ ${n.toLocaleString("en-US")}`;

/** Fill in on the left (top on a phone), the printable bilingual slip below. Only the slip prints. */
export function PayslipForm({ caretakers, who, month, lang, initial, employer, prefilled, hasRecord, saved }: Props) {
  const t = useT();
  const router = useRouter();
  const [s, setS] = useState<Slip>(initial);
  const go = (q: { m?: string; month?: string; lang?: string }) => {
    const p = new URLSearchParams({ m: q.m ?? who.id, month: q.month ?? month, lang: q.lang ?? lang });
    router.replace(`/labs/payslip?${p}`);
  };
  const num = (k: keyof Slip) => ({
    name: k,
    inputMode: "numeric" as const,
    className: "field tabular text-right",
    value: s[k] ? String(s[k]) : "",
    placeholder: "0",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setS({ ...s, [k]: Math.min(1_000_000, Number(e.target.value.replace(/\D/g, "")) || 0) }),
  });
  const { gross, deduct, net } = slipTotals(s);

  // A label in Chinese with the chosen language under it
  const Bi = ({ k, big }: { k: Key; big?: boolean }) => (
    <span className="block leading-tight">
      <span className={big ? "text-lg font-extrabold" : "font-bold"}>{translate("zh-TW", k)}</span>
      <span className="block text-[13px] text-muted">{translate(lang, k)}</span>
    </span>
  );

  return (
    <div className="space-y-6">
      <div className="no-print card space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="who">{t("psWho")}</label>
            <select id="who" className="field" value={who.id} onChange={(e) => go({ m: e.target.value })}>
              {caretakers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="month">{t("psMonthPick")}</label>
            <input id="month" type="month" className="field" value={month} onChange={(e) => e.target.value && go({ month: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="slang">{t("psLang")}</label>
          <select id="slang" className="field" value={lang} onChange={(e) => go({ lang: e.target.value })}>
            {SLIP_LANGS.map((l) => <option key={l.code} value={l.code}>中文 + {l.label}</option>)}
          </select>
        </div>
      </div>

      <form action={savePayslip} className="no-print card space-y-4">
        <input type="hidden" name="member" value={who.id} />
        <input type="hidden" name="month" value={month} />
        <input type="hidden" name="lang" value={lang} />
        <Field label={translate("zh-TW", "ps_base")} hint={prefilled ? t("psPrefilled") : undefined}><input {...num("base")} /></Field>
        <Field label={translate("zh-TW", "ps_overtime")}>
          <input {...num("overtime")} />
          <input name="overtimeNote" className="field mt-2" maxLength={120} placeholder={t("psOvertimeNote")} value={s.overtimeNote} onChange={(e) => setS({ ...s, overtimeNote: e.target.value })} />
        </Field>
        <Field label={translate("zh-TW", "ps_otherPay")}><input {...num("otherPay")} /></Field>
        <Field label={translate("zh-TW", "ps_nhi")} hint={t("psNhiHint")}><input {...num("nhi")} /></Field>
        <Field label={translate("zh-TW", "ps_otherDeduct")}>
          <input {...num("otherDeduct")} />
          <input name="otherDeductNote" className="field mt-2" maxLength={120} placeholder={t("psOtherNote")} value={s.otherDeductNote} onChange={(e) => setS({ ...s, otherDeductNote: e.target.value })} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={translate("zh-TW", "ps_paidDate")}>
            <input name="paidDate" type="date" className="field" value={s.paidDate} onChange={(e) => setS({ ...s, paidDate: e.target.value })} />
          </Field>
          <Field label={translate("zh-TW", "ps_method")}>
            <select name="method" className="field" value={s.method} onChange={(e) => setS({ ...s, method: e.target.value === "bank" ? "bank" : "cash" })}>
              <option value="cash">{translate("zh-TW", "ps_cash")}</option>
              <option value="bank">{translate("zh-TW", "ps_bank")}</option>
            </select>
          </Field>
        </div>
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-sunk p-4">
          <input type="checkbox" name="record" defaultChecked={!hasRecord} className="mt-0.5 h-6 w-6 shrink-0 accent-[var(--accent)]" />
          <span className="text-base font-semibold">
            {t("psAlsoRecord")}
            {hasRecord && <span className="mt-1 block text-[14px] text-warn">{t("psAlreadyRecord")}</span>}
          </span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <Submit className="btn-primary">{saved ? <><Check size={20} /> {t("psSaved")}</> : t("psSave")}</Submit>
          <button type="button" className="btn-tint" onClick={() => window.print()}>
            <Printer size={20} /> {t("psPrint")}
          </button>
        </div>
      </form>

      {/* The slip itself: the only part that prints */}
      <article className="print-slip card space-y-4 !p-5">
        <header className="text-center">
          <h2 className="text-2xl font-extrabold">{translate("zh-TW", "ps_title")}</h2>
          <p className="text-base text-muted">{translate(lang, "ps_title")}</p>
        </header>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[15px]">
          <dt><Bi k="ps_employer" /></dt><dd className="self-center text-right font-semibold">{employer}</dd>
          <dt><Bi k="ps_worker" /></dt><dd className="self-center text-right font-semibold">{who.name}</dd>
          <dt><Bi k="ps_month" /></dt><dd className="tabular self-center text-right font-semibold">{month}</dd>
          <dt><Bi k="ps_paidDate" /></dt><dd className="tabular self-center text-right font-semibold">{s.paidDate}</dd>
          <dt><Bi k="ps_method" /></dt>
          <dd className="self-center text-right font-semibold">
            {translate("zh-TW", s.method === "bank" ? "ps_bank" : "ps_cash")} / {translate(lang, s.method === "bank" ? "ps_bank" : "ps_cash")}
          </dd>
        </dl>
        <table className="w-full border-collapse text-[15px]">
          <tbody>
            <Line label={<Bi k="ps_base" />} amount={s.base} />
            <Line label={<Bi k="ps_overtime" />} amount={s.overtime} note={s.overtimeNote} />
            <Line label={<Bi k="ps_otherPay" />} amount={s.otherPay} />
            <Line label={<Bi k="ps_gross" />} amount={gross} strong />
            <Line label={<Bi k="ps_nhi" />} amount={-s.nhi} />
            <Line label={<Bi k="ps_otherDeduct" />} amount={-s.otherDeduct} note={s.otherDeductNote} />
            <Line label={<Bi k="ps_deductTotal" />} amount={-deduct} strong />
            <tr className="border-t-2 border-[var(--ink)]">
              <td className="py-3"><Bi k="ps_net" big /></td>
              <td className="tabular whitespace-nowrap py-3 text-right text-2xl font-extrabold">{net < 0 ? `− ${nt(-net)}` : nt(net)}</td>
            </tr>
          </tbody>
        </table>
        <div className="grid grid-cols-2 gap-4 pt-2">
          {(["ps_signEmployer", "ps_signWorker"] as const).map((k) => (
            <div key={k}>
              <div className="h-16 border-b border-[var(--ink)]" />
              <div className="mt-1 text-[13px]"><Bi k={k} /></div>
            </div>
          ))}
        </div>
        <footer className="space-y-1 border-t border-[var(--line)] pt-3 text-[12px] text-muted">
          <p>{translate("zh-TW", "ps_rule")}</p>
          <p>{translate(lang, "ps_rule")}</p>
        </footer>
      </article>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="label">{label}</div>
      {children}
      {hint && <p className="mt-1 text-[14px] text-muted">{hint}</p>}
    </div>
  );
}

function Line({ label, amount, note, strong }: { label: React.ReactNode; amount: number; note?: string; strong?: boolean }) {
  return (
    <tr className={`border-t border-[var(--line)] ${strong ? "bg-sunk" : ""}`}>
      <td className="py-2 pr-2 align-top">
        {label}
        {note && <span className="mt-0.5 block text-[13px] italic">{note}</span>}
      </td>
      <td className={`tabular py-2 text-right align-top ${strong ? "font-extrabold" : "font-semibold"}`}>
        {amount < 0 ? `− ${nt(-amount)}` : nt(Math.abs(amount))}
      </td>
    </tr>
  );
}

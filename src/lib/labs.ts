/**
 * Labs: the employer checklist. A fixed template of what a household employer of a live-in caregiver
 * has to do, turned into dated items for one caretaker from her arrival date, contract start and ARC expiry.
 * Facts and sources: growth/research/employer-obligations.md (以勞動部最新公告為準).
 */
import type { Key } from "./i18n";

export type Group = "monthly" | "quarterly" | "once" | "periodic";
export type ItemKey =
  | "salary" | "payslip" | "nhi"
  | "esf" | "occ"
  | "prehire" | "careplan" | "entry_check" | "nhi_enrol" | "occ_enrol" | "arc_apply"
  | "check6" | "check18" | "check30" | "arc_renew" | "contract_end";

const MOL = "https://www.mol.gov.tw";
const CDC_CHECKS = "https://www.cdc.gov.tw/En/File/Get/WVRK1JQJcrgTNObsPXBMyQ";
const WDA = "https://www.wda.gov.tw/";
const IMMIGRATION = "https://www.immigration.gov.tw/5385/12162/12197/CP_QA";

export const ITEMS: Record<ItemKey, { group: Group; link: string }> = {
  salary: { group: "monthly", link: `${MOL}/1607/1632/1640/54530/` },
  payslip: { group: "monthly", link: "https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=N0090027" },
  nhi: { group: "monthly", link: "https://mohw.gov.tw/cp-16-73649-1.html" },
  esf: { group: "quarterly", link: `${MOL}/1607/1632/1640/43417/` },
  occ: { group: "quarterly", link: `${MOL}/1607/1632/1640/57444/` },
  prehire: { group: "once", link: WDA },
  careplan: { group: "once", link: WDA },
  entry_check: { group: "once", link: CDC_CHECKS },
  nhi_enrol: { group: "once", link: "https://mohw.gov.tw/cp-16-73649-1.html" },
  occ_enrol: { group: "once", link: `${MOL}/1607/1632/1640/57444/` },
  arc_apply: { group: "once", link: IMMIGRATION },
  check6: { group: "periodic", link: CDC_CHECKS },
  check18: { group: "periodic", link: CDC_CHECKS },
  check30: { group: "periodic", link: CDC_CHECKS },
  arc_renew: { group: "periodic", link: IMMIGRATION },
  contract_end: { group: "periodic", link: `${MOL}/1607/1632/1640/43427/` },
};

export const isItemKey = (k: string): k is ItemKey => Object.hasOwn(ITEMS, k);
export const titleKey = (k: ItemKey) => `lab_${k}` as Key;
export const descKey = (k: ItemKey) => `lab_${k}_d` as Key;

export type Dates = { arrival_date: string | null; contract_start: string | null; arc_expiry: string | null };
export type Status = "overdue" | "soon" | "later" | "done";
export type Item = { key: ItemKey; group: Group; period: string; due: string; status: Status; doneAt: number | null };

export const isDay = (v: unknown): v is string => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(`${v}T00:00:00Z`));
export const isMonth = (v: unknown): v is string => typeof v === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(v);

// Plain calendar arithmetic on YYYY-MM-DD strings (UTC, no time zone surprises)
const toDate = (d: string) => new Date(`${d}T00:00:00Z`);
const fmt = (d: Date) => d.toISOString().slice(0, 10);
export const addDays = (d: string, n: number) => fmt(new Date(toDate(d).getTime() + n * 86_400_000));
export function addMonths(d: string, n: number) {
  const x = toDate(d);
  const day = x.getUTCDate();
  x.setUTCDate(1);
  x.setUTCMonth(x.getUTCMonth() + n);
  const last = new Date(Date.UTC(x.getUTCFullYear(), x.getUTCMonth() + 1, 0)).getUTCDate();
  x.setUTCDate(Math.min(day, last));
  return fmt(x);
}
/** n working days after d (weekends skipped; public holidays are not known here). */
function addWorkDays(d: string, n: number) {
  let x = d;
  while (n > 0) {
    x = addDays(x, 1);
    const wd = toDate(x).getUTCDay();
    if (wd !== 0 && wd !== 6) n--;
  }
  return x;
}
const lastDayOf = (month: string) => addDays(addMonths(`${month}-01`, 1), -1);
const prevMonth = (month: string) => addMonths(`${month}-01`, -1).slice(0, 7);

/**
 * The items to show today for one caretaker. `done` maps "item_key|period" to when it was ticked.
 * - Monthly: this month and last month.
 * - Quarterly (就業安定費, 職保): the quarter due most recently and the next one, due the 25th of Feb/May/Aug/Nov.
 * - Arrival tasks: only in her first 6 months.
 * - Health checks, ARC and contract end: from their dates, when not long past.
 */
export function buildChecklist(dates: Dates, today: string, done: Map<string, number>): Item[] {
  const raw: { key: ItemKey; period: string; due: string; from: string }[] = [];
  const start = dates.arrival_date ?? dates.contract_start;
  const thisMonth = today.slice(0, 7);

  for (const m of [prevMonth(thisMonth), thisMonth]) {
    if (start && lastDayOf(m) < start) continue;
    for (const key of ["salary", "payslip", "nhi"] as const) raw.push({ key, period: m, due: lastDayOf(m), from: `${m}-01` });
  }

  // Quarter q (1-4) of year y is due on the 25th of the 2nd month of the next quarter
  const y = Number(today.slice(0, 4));
  for (const year of [y - 1, y]) {
    for (let q = 1; q <= 4; q++) {
      const m = q * 3 + 2; // May, Aug, Nov, then Feb of the next year
      const due = m > 12 ? `${year + 1}-${String(m - 12).padStart(2, "0")}-25` : `${year}-${String(m).padStart(2, "0")}-25`;
      const quarterEnd = lastDayOf(`${year}-${String(q * 3).padStart(2, "0")}`);
      if (start && quarterEnd < start) continue;
      if (due < addDays(today, -100) || due > addDays(today, 100)) continue;
      for (const key of ["esf", "occ"] as const) raw.push({ key, period: `${year}Q${q}`, due, from: addDays(due, -30) });
    }
  }

  const a = dates.arrival_date;
  if (a) {
    if (today <= addDays(a, 183)) {
      raw.push({ key: "prehire", period: "once", due: a, from: addDays(a, -60) });
      raw.push({ key: "careplan", period: "once", due: a, from: addDays(a, -60) });
      raw.push({ key: "occ_enrol", period: "once", due: a, from: addDays(a, -30) });
      raw.push({ key: "entry_check", period: "once", due: addWorkDays(a, 3), from: a });
      raw.push({ key: "nhi_enrol", period: "once", due: addDays(a, 3), from: a });
      raw.push({ key: "arc_apply", period: "once", due: addDays(a, 30), from: a });
    }
    for (const [key, months] of [["check6", 6], ["check18", 18], ["check30", 30]] as const) {
      const mid = addMonths(a, months);
      const due = addDays(mid, 30);
      if (due >= addDays(today, -183)) raw.push({ key, period: mid, due, from: addDays(mid, -30) });
    }
  }
  if (dates.arc_expiry && dates.arc_expiry >= addDays(today, -183)) {
    raw.push({ key: "arc_renew", period: dates.arc_expiry, due: dates.arc_expiry, from: addDays(dates.arc_expiry, -60) });
  }
  if (dates.contract_start) {
    const end = addDays(addMonths(dates.contract_start, 36), -1);
    if (end >= addDays(today, -183)) raw.push({ key: "contract_end", period: end, due: end, from: addDays(end, -120) });
  }

  return raw
    .map((r) => {
      const doneAt = done.get(`${r.key}|${r.period}`) ?? null;
      const status: Status = doneAt ? "done" : r.due < today ? "overdue" : r.from <= today ? "soon" : "later";
      return { key: r.key, group: ITEMS[r.key].group, period: r.period, due: r.due, status, doneAt };
    })
    .sort((x, y) => x.due.localeCompare(y.due));
}

/** Second languages a slip can be printed in, next to Chinese. */
export const SLIP_LANGS = [
  { code: "id", label: "Bahasa Indonesia" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "tl", label: "Tagalog" },
  { code: "th", label: "ภาษาไทย" },
  { code: "en", label: "English" },
] as const;
export type SlipLang = (typeof SLIP_LANGS)[number]["code"];
export const isSlipLang = (v: unknown): v is SlipLang => SLIP_LANGS.some((l) => l.code === v);

export type Slip = {
  base: number;
  overtime: number;
  overtimeNote: string;
  otherPay: number;
  nhi: number;
  otherDeduct: number;
  otherDeductNote: string;
  paidDate: string;
  method: "cash" | "bank";
};

export const slipTotals = (s: Slip) => {
  const gross = s.base + s.overtime + s.otherPay;
  const deduct = s.nhi + s.otherDeduct;
  return { gross, deduct, net: gross - deduct };
};

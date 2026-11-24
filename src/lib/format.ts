export const TZ = "Asia/Taipei";

/** Short money: "$1,240" for Taiwan dollars (the balance card says NTD once), else the currency code. */
export function money(amount: number, currency = "TWD") {
  const n = Math.abs(amount).toLocaleString("en-US", { maximumFractionDigits: 0 });
  const sign = amount < 0 ? "−" : "";
  return currency === "TWD" ? `${sign}$${n}` : `${sign}${currency} ${n}`;
}

export function when(ms: number, lang: string) {
  return new Date(ms).toLocaleString(lang, {
    timeZone: TZ,
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function monthLabel(ms: number, lang: string) {
  return new Date(ms).toLocaleDateString(lang, { timeZone: TZ, year: "numeric", month: "long" });
}

export function monthKey(ms: number) {
  const d = new Date(ms).toLocaleDateString("en-CA", { timeZone: TZ });
  return d.slice(0, 7);
}

/** Start of the current month in Taiwan time, as epoch ms. */
export function monthStart() {
  return Date.parse(`${today().slice(0, 7)}-01T00:00:00+08:00`);
}

export function today() {
  return new Date().toLocaleDateString("en-CA", { timeZone: TZ });
}

export const CATEGORIES = [{ id: "food" }, { id: "daily" }, { id: "transport" }, { id: "medicine" }, { id: "other" }] as const;

export const KINDS = [{ id: "salary" }, { id: "health" }, { id: "other" }] as const;

/** Icon id for a phase 2 record kind (its "other" icon differs from the expense category's). */
export const kindIconId = (kind: string) => (kind === "other" ? "record_other" : kind);

/** Date only, relative while recent: "today", "yesterday", "3 days ago", then "11/24". In the reader's language. */
export function day(ms: number, lang: string) {
  const toDay = (t: number) => Date.parse(`${new Date(t).toLocaleDateString("en-CA", { timeZone: TZ })}T00:00:00Z`) / 86_400_000;
  const diff = Math.round(toDay(ms) - toDay(Date.now()));
  if (diff <= 0 && diff > -7) {
    try {
      return new Intl.RelativeTimeFormat(lang, { numeric: "auto" }).format(diff, "day");
    } catch {}
  }
  return new Date(ms).toLocaleDateString(lang, { timeZone: TZ, month: "numeric", day: "numeric" });
}

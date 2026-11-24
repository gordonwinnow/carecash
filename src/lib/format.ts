export const TZ = "Asia/Taipei";

export function money(amount: number, currency = "TWD") {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en-US")}`;
  }
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

export const CATEGORIES = [
  { id: "food", icon: "🥬" },
  { id: "daily", icon: "🧴" },
  { id: "transport", icon: "🚌" },
  { id: "medicine", icon: "💊" },
  { id: "other", icon: "📦" },
] as const;

export const KINDS = [
  { id: "salary", icon: "💰" },
  { id: "health", icon: "🏥" },
  { id: "other", icon: "📄" },
] as const;

export function catIcon(id: string) {
  return CATEGORIES.find((c) => c.id === id)?.icon ?? "📦";
}
export function kindIcon(id: string) {
  return KINDS.find((c) => c.id === id)?.icon ?? "📄";
}

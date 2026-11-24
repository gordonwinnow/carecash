import {
  Banknote,
  Bus,
  FileText,
  Package,
  Pill,
  ShoppingBasket,
  SprayCan,
  Stethoscope,
  Wallet,
  type LucideIcon,
} from "lucide-react";

/** One line-icon set for the whole app, drawn in the same weight as the text. */
const ICONS: Record<string, LucideIcon> = {
  food: ShoppingBasket,
  daily: SprayCan,
  transport: Bus,
  medicine: Pill,
  other: Package,
  salary: Wallet,
  health: Stethoscope,
  record_other: FileText,
  cash: Banknote,
};

/** A tinted rounded square holding a category, record kind or cash icon. */
export function Badge({ id, size = 56, tone }: { id: string; size?: number; tone?: string }) {
  const Icon = ICONS[id] ?? Package;
  const toneId = tone ?? (id === "record_other" ? "other" : id);
  return (
    <span className={`badge tone-${toneId}`} style={{ width: size, height: size }}>
      <Icon size={Math.round(size * 0.46)} strokeWidth={2} />
    </span>
  );
}

export function iconFor(id: string) {
  return ICONS[id] ?? Package;
}

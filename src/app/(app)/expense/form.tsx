import { Check } from "lucide-react";
import { CATEGORIES } from "@/lib/format";
import type { T } from "@/lib/i18n";
import { AmountInput, ChipGroup, PhotoInput, Submit } from "@/components/ui";
import { Badge } from "@/components/icons";

type Initial = { amount: number; category: string; note: string | null; photo: string | null };

/** Add and edit share one form. The amount comes first and is focused, so the number pad is ready. */
export function ExpenseFields({ t, initial }: { t: T; initial?: Initial }) {
  return (
    <>
      <AmountInput autoFocus={!initial} initial={initial?.amount} />
      <div>
        <div className="label">{t("category")}</div>
        <ChipGroup
          name="category"
          initial={initial?.category}
          cols={5}
          compact
          options={CATEGORIES.map((c) => ({ value: c.id, icon: <Badge id={c.id} size={38} />, label: t(`cat_${c.id}`) }))}
        />
      </div>
      <PhotoInput label={initial?.photo ? t("replacePhoto") : t("takePhoto")} existing={initial?.photo} />
      <div>
        <label className="label" htmlFor="note">{t("note")}</label>
        <input id="note" name="note" className="field" maxLength={200} defaultValue={initial?.note ?? ""} />
      </div>
      <Submit className="btn-primary min-h-18 text-2xl">
        <Check size={26} strokeWidth={2.6} /> {initial ? t("saveChanges") : t("save")}
      </Submit>
    </>
  );
}

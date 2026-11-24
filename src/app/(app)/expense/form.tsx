import { Check, Crown, UserRound } from "lucide-react";
import { CATEGORIES } from "@/lib/format";
import type { T } from "@/lib/i18n";
import { AmountInput, ChipGroup, PhotoInput, Submit } from "@/components/ui";
import { Badge } from "@/components/icons";

type Initial = { amount: number; category: string; note: string | null; photo: string | null; member_id?: string };
/** For employers: who paid. Caretakers pay from their household cash; "me" is the employer themselves. */
type Payers = { me: string; caretakers: { id: string; name: string }[]; initial: string };

/** Add and edit share one form. The amount comes first and is focused, so the number pad is ready. */
export function ExpenseFields({ t, initial, payers }: { t: T; initial?: Initial; payers?: Payers }) {
  return (
    <>
      <AmountInput autoFocus={!initial} initial={initial?.amount} />
      {payers && payers.caretakers.length > 0 && (
        <div>
          <div className="label">{t("paidBy")}</div>
          <ChipGroup
            name="payer"
            cols={Math.min(3, payers.caretakers.length + 1)}
            initial={payers.initial}
            options={[
              ...payers.caretakers.map((c) => ({ value: c.id, label: c.name, icon: <UserRound size={20} /> })),
              { value: payers.me, label: t("myself"), icon: <Crown size={20} /> },
            ]}
          />
        </div>
      )}
      {payers && payers.caretakers.length === 0 && <input type="hidden" name="payer" value={payers.me} />}
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

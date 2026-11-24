import { getT, requireCtx } from "@/lib/ctx";
import { CATEGORIES } from "@/lib/format";
import { addExpense } from "../../../actions";
import { AmountInput, BackHeader, ChipGroup, PhotoInput, Submit } from "@/components/ui";

export default async function NewExpense() {
  await requireCtx();
  const t = await getT();
  return (
    <form action={addExpense} className="space-y-5">
      <BackHeader title={t("addExpense")} />
      <PhotoInput label={t("takePhoto")} />
      <AmountInput />
      <div>
        <div className="label">{t("category")}</div>
        <ChipGroup name="category" options={CATEGORIES.map((c) => ({ value: c.id, icon: c.icon, label: t(`cat_${c.id}`) }))} />
      </div>
      <div>
        <label className="label" htmlFor="note">{t("note")}</label>
        <input id="note" name="note" className="field" maxLength={200} />
      </div>
      <Submit className="btn-primary min-h-20 text-2xl">✅ {t("save")}</Submit>
    </form>
  );
}

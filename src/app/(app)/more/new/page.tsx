import { db } from "@/lib/db";
import { getT, requireAdmin } from "@/lib/ctx";
import { KINDS, today } from "@/lib/format";
import { addRecord } from "../../../actions";
import { AmountInput, BackHeader, ChipGroup, PhotoInput, Submit } from "@/components/ui";

export default async function NewRecord() {
  const { me } = await requireAdmin();
  const t = await getT();
  const caretakers = db
    .prepare("select id, name from member where family_id = ? and role = 'caretaker' and active = 1 order by created_at")
    .all(me.family_id) as { id: string; name: string }[];
  return (
    <form action={addRecord} className="space-y-5">
      <BackHeader title={t("addRecord")} href="/more" />
      <ChipGroup name="kind" options={KINDS.map((k) => ({ value: k.id, icon: k.icon, label: t(`kind_${k.id}`) }))} />
      <AmountInput />
      {caretakers.length > 0 && (
        <div>
          <div className="label">{t("forWho")}</div>
          <ChipGroup
            name="caretaker"
            cols={2}
            options={[...caretakers.map((c) => ({ value: c.id, label: c.name, icon: "🙋" })), { value: "", label: t("general"), icon: "🏠" }]}
          />
        </div>
      )}
      <div>
        <label className="label" htmlFor="date">{t("date")}</label>
        <input id="date" name="date" type="date" defaultValue={today()} className="field" required />
      </div>
      <div>
        <label className="label" htmlFor="note">{t("note")}</label>
        <input id="note" name="note" className="field" maxLength={200} />
      </div>
      <PhotoInput big={false} label={t("addPhoto")} />
      <label className="flex min-h-16 cursor-pointer items-center gap-4 rounded-2xl border-2 border-line bg-card px-4">
        <input type="checkbox" name="shared" className="h-7 w-7 accent-[var(--accent)]" />
        <span className="text-lg font-semibold">👁 {t("shareWithCaretaker")}</span>
      </label>
      <Submit className="btn-primary min-h-20 text-2xl">✅ {t("save")}</Submit>
    </form>
  );
}

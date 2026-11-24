import { Check, House, UserRound } from "lucide-react";
import { KINDS, kindIconId, today } from "@/lib/format";
import type { T } from "@/lib/i18n";
import { AmountInput, ChipGroup, PhotoInput, Submit } from "@/components/ui";
import { Badge } from "@/components/icons";

type Initial = { kind: string; amount: number; caretaker_id: string | null; date: string; note: string | null; photo: string | null; shared: number };

export function RecordFields({ t, caretakers, initial, forWho }: { t: T; caretakers: { id: string; name: string }[]; initial?: Initial; forWho?: string }) {
  return (
    <>
      <AmountInput autoFocus={!initial} initial={initial?.amount} />
      <ChipGroup
        name="kind"
        initial={initial?.kind}
        options={KINDS.map((k) => ({ value: k.id, icon: <Badge id={kindIconId(k.id)} size={36} />, label: t(`kind_${k.id}`) }))}
      />
      {caretakers.length > 0 && (
        <div>
          <div className="label">{t("forWho")}</div>
          <ChipGroup
            name="caretaker"
            cols={2}
            initial={initial ? (initial.caretaker_id ?? "") : forWho}
            options={[
              ...caretakers.map((c) => ({ value: c.id, label: c.name, icon: <UserRound size={22} /> })),
              { value: "", label: t("general"), icon: <House size={22} /> },
            ]}
          />
        </div>
      )}
      <div>
        <label className="label" htmlFor="note">{t("note")}</label>
        <input id="note" name="note" className="field" maxLength={200} defaultValue={initial?.note ?? ""} />
      </div>
      {/* Date always right below the note, as on every form */}
      <div>
        <label className="label" htmlFor="date">{t("date")}</label>
        <input id="date" name="date" type="date" defaultValue={initial?.date ?? today()} className="field" required />
      </div>
      <PhotoInput big={false} label={initial?.photo ? t("replacePhoto") : t("addPhoto")} existing={initial?.photo} />
      <label className="flex min-h-16 cursor-pointer items-center justify-between gap-4 rounded-2xl bg-card px-5 [box-shadow:var(--shadow)]">
        <span className="text-lg font-semibold">{t("shareWithCaretaker")}</span>
        <input type="checkbox" name="shared" defaultChecked={!!initial?.shared} className="h-7 w-7 accent-[var(--accent)]" />
      </label>
      <Submit className="btn-primary min-h-18 text-2xl">
        <Check size={26} strokeWidth={2.6} /> {initial ? t("saveChanges") : t("save")}
      </Submit>
    </>
  );
}

import { redirect } from "next/navigation";
import { Check, Info, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { getLang, getT, requireCtx } from "@/lib/ctx";
import { historyOf } from "@/lib/audit";
import { deleteCash, updateCash } from "../../../actions";
import { ActionButton, AmountInput, BackHeader, Submit } from "@/components/ui";
import { ByLine, ChangeList } from "@/components/changes";
import { SectionHead } from "@/components/rows";

export default async function EditCash({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { me } = await requireCtx();
  const t = await getT();
  const lang = await getLang();
  const c = db
    .prepare("select c.*, m.name as caretaker from cash c join member m on m.id = c.caretaker_id where c.id = ? and c.family_id = ?")
    .get(id, me.family_id) as
    | { id: string; caretaker_id: string; created_by: string | null; amount: number; note: string | null; confirmed_at: number | null; caretaker: string }
    | undefined;
  const isAdmin = me.role === "admin";
  const own = !!c && c.created_by === me.id && c.caretaker_id === me.id;
  if (!c || !(isAdmin || own)) redirect("/history");
  const canDelete = isAdmin || !c.confirmed_at;
  const changes = historyOf(c.id, me);

  return (
    <div className="space-y-8">
      <form action={updateCash.bind(null, c.id)} className="space-y-6">
        <BackHeader title={t("editCash")} href="/history" />
        <ByLine rows={changes} t={t} lang={lang} />
        {isAdmin && <p className="-mt-3 px-1 text-lg text-muted">{t("cashTo", { name: c.caretaker })}</p>}
        <AmountInput initial={c.amount} />
        <p className="flex items-start gap-2 px-1 text-[15px] text-muted">
          <Info size={18} className="mt-0.5 shrink-0" /> {t("reagree")}
        </p>
        <div>
          <label className="label" htmlFor="note">{t("note")}</label>
          <input id="note" name="note" className="field" maxLength={200} defaultValue={c.note ?? ""} />
        </div>
        <Submit className="btn-primary min-h-18 text-2xl">
          <Check size={26} strokeWidth={2.6} /> {t("saveChanges")}
        </Submit>
      </form>
      {canDelete && (
        <ActionButton action={deleteCash.bind(null, c.id, "/history")} confirm={t("confirmDelete")} className="btn bg-bad-soft text-bad">
          <Trash2 size={22} /> {t("delete")}
        </ActionButton>
      )}
      {changes.length > 0 && (
        <section>
          <SectionHead title={t("changeHistory")} />
          <div className="card !p-2">
            <ChangeList rows={changes} t={t} lang={lang} currency={me.currency} />
          </div>
        </section>
      )}
    </div>
  );
}

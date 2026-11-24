import { redirect } from "next/navigation";
import { Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { getLang, getT, requireAdmin } from "@/lib/ctx";
import { historyOf } from "@/lib/audit";
import { deleteRecord, updateRecord } from "../../../actions";
import { ActionButton, BackHeader } from "@/components/ui";
import { ByLine, ChangeList } from "@/components/changes";
import { SectionHead } from "@/components/rows";
import { RecordFields } from "../form";

export default async function EditRecord({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { me } = await requireAdmin();
  const t = await getT();
  const lang = await getLang();
  const r = db.prepare("select * from record where id = ? and family_id = ?").get(id, me.family_id) as
    | { id: string; kind: string; amount: number; caretaker_id: string | null; date: string; note: string | null; photo: string | null; shared: number }
    | undefined;
  if (!r) redirect("/more");
  const caretakers = db
    .prepare("select id, name from member where family_id = ? and role = 'caretaker' order by created_at")
    .all(me.family_id) as { id: string; name: string }[];
  const names = Object.fromEntries(caretakers.map((c) => [c.id, c.name]));
  const changes = historyOf(r.id, me);

  return (
    <div className="space-y-8">
      <form action={updateRecord.bind(null, r.id)} className="space-y-6">
        <BackHeader title={t("editRecord")} href="/more" />
        <ByLine rows={changes} t={t} lang={lang} />
        <RecordFields t={t} caretakers={caretakers} initial={r} />
      </form>
      <ActionButton action={deleteRecord.bind(null, r.id, "/more")} confirm={t("confirmDelete")} className="btn bg-bad-soft text-bad">
        <Trash2 size={22} /> {t("delete")}
      </ActionButton>
      {changes.length > 0 && (
        <section>
          <SectionHead title={t("changeHistory")} />
          <div className="card !p-2">
            <ChangeList rows={changes} t={t} lang={lang} currency={me.currency} names={names} />
          </div>
        </section>
      )}
    </div>
  );
}

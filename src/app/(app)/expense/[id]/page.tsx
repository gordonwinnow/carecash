import { redirect } from "next/navigation";
import { Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { getLang, getT, requireCtx } from "@/lib/ctx";
import { historyOf } from "@/lib/audit";
import { deleteExpense, updateExpense } from "../../../actions";
import { ActionButton, BackHeader } from "@/components/ui";
import { ByLine, ChangeList } from "@/components/changes";
import { SectionHead } from "@/components/rows";
import { ExpenseFields } from "../form";

export default async function EditExpense({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { me } = await requireCtx();
  const t = await getT();
  const lang = await getLang();
  const e = db.prepare("select * from expense where id = ? and family_id = ?").get(id, me.family_id) as
    | { id: string; member_id: string; amount: number; category: string; note: string | null; photo: string | null }
    | undefined;
  if (!e || (me.role !== "admin" && e.member_id !== me.id)) redirect("/history");
  const changes = historyOf(e.id, me);
  const caretakers =
    me.role === "admin"
      ? (db.prepare("select id, name from member where family_id = ? and role = 'caretaker' and active = 1 order by created_at").all(me.family_id) as { id: string; name: string }[])
      : [];
  const names = Object.fromEntries(
    (db.prepare("select id, name from member where family_id = ?").all(me.family_id) as { id: string; name: string }[]).map((m) => [m.id, m.name]),
  );

  return (
    <div className="space-y-8">
      <form action={updateExpense.bind(null, e.id)} className="space-y-6">
        <BackHeader title={t("editExpense")} href="/history" />
        <ByLine rows={changes} t={t} lang={lang} />
        <ExpenseFields t={t} initial={e} payers={me.role === "admin" ? { me: me.id, caretakers, initial: e.member_id } : undefined} />
      </form>
      <ActionButton action={deleteExpense.bind(null, e.id, "/history")} confirm={t("confirmDelete")} className="btn bg-bad-soft text-bad">
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

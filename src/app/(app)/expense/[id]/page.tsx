import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageCircle, Trash2 } from "lucide-react";
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
  // An employer looking at the caregiver's expense, probably with a question: offer the gentle way to ask
  const herExpense = me.role === "admin" && e.member_id !== me.id;
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
        {herExpense && (
          <Link href={`/phrases?for=${e.member_id}&p=just-asking`} className="card flex items-center gap-3 hover:[box-shadow:var(--shadow)]">
            <span className="badge h-11 w-11 shrink-0 rounded-2xl"><MessageCircle size={22} /></span>
            <span className="min-w-0 flex-1 text-base font-semibold leading-snug">{t("askGently")}</span>
          </Link>
        )}
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

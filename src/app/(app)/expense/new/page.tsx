import { db } from "@/lib/db";
import { getT, requireCtx } from "@/lib/ctx";
import { addExpense } from "../../../actions";
import { BackHeader } from "@/components/ui";
import { ExpenseFields } from "../form";

export default async function NewExpense({ searchParams }: { searchParams: Promise<{ for?: string }> }) {
  const { me } = await requireCtx();
  const t = await getT();
  const sp = await searchParams;
  // Employers say who paid; it starts on the caretaker they came from, else the first one
  const caretakers =
    me.role === "admin"
      ? (db.prepare("select id, name from member where family_id = ? and role = 'caretaker' and active = 1 order by created_at").all(me.family_id) as { id: string; name: string }[])
      : [];
  const payers =
    me.role === "admin"
      ? { me: me.id, caretakers, initial: caretakers.find((c) => c.id === sp.for)?.id ?? caretakers[0]?.id ?? me.id }
      : undefined;
  return (
    <form action={addExpense} className="space-y-6">
      <BackHeader title={t("addExpense")} />
      <ExpenseFields t={t} payers={payers} />
    </form>
  );
}

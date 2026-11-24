import { getT, requireCtx } from "@/lib/ctx";
import { addExpense } from "../../../actions";
import { BackHeader } from "@/components/ui";
import { ExpenseFields } from "../form";

export default async function NewExpense() {
  await requireCtx();
  const t = await getT();
  return (
    <form action={addExpense} className="space-y-6">
      <BackHeader title={t("addExpense")} />
      <ExpenseFields t={t} />
    </form>
  );
}

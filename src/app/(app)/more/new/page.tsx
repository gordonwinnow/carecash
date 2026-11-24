import { db } from "@/lib/db";
import { getT, requireAdmin } from "@/lib/ctx";
import { addRecord } from "../../../actions";
import { BackHeader } from "@/components/ui";
import { RecordFields } from "../form";

export default async function NewRecord() {
  const { me } = await requireAdmin();
  const t = await getT();
  const caretakers = db
    .prepare("select id, name from member where family_id = ? and role = 'caretaker' and active = 1 order by created_at")
    .all(me.family_id) as { id: string; name: string }[];
  return (
    <form action={addRecord} className="space-y-6">
      <BackHeader title={t("addRecord")} href="/more" />
      <RecordFields t={t} caretakers={caretakers} />
    </form>
  );
}

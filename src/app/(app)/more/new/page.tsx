import { db } from "@/lib/db";
import { getT, requireAdmin } from "@/lib/ctx";
import { canAdd } from "@/lib/billing";
import { LimitNotice } from "@/components/plan";
import { addRecord } from "../../../actions";
import { BackHeader } from "@/components/ui";
import { RecordFields } from "../form";

export default async function NewRecord({ searchParams }: { searchParams: Promise<{ for?: string }> }) {
  const sp = await searchParams;
  const { me } = await requireAdmin();
  const t = await getT();
  const caretakers = db
    .prepare("select id, name from member where family_id = ? and role = 'caretaker' and active = 1 order by created_at")
    .all(me.family_id) as { id: string; name: string }[];
  if (!canAdd(me.family_id)) return <div className="space-y-6"><BackHeader title={t("addRecord")} href="/more" /><LimitNotice familyId={me.family_id} role={me.role} t={t} /></div>;
  return (
    <form action={addRecord} className="space-y-6">
      <BackHeader title={t("addRecord")} href={sp.for ? "/home" : "/more"} />
      <RecordFields t={t} caretakers={caretakers} forWho={caretakers.some((c) => c.id === sp.for) ? sp.for : undefined} />
    </form>
  );
}

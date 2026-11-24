import { db } from "@/lib/db";
import { getLang, getT, requireCtx } from "@/lib/ctx";
import { familyActivity } from "@/lib/audit";
import { BackHeader } from "@/components/ui";
import { ChangeList } from "@/components/changes";
import { Empty } from "@/components/rows";

/** Every add, edit, delete and confirmation in the family, newest first. Caretakers see changes to their own entries. */
export default async function Activity() {
  const { me } = await requireCtx();
  const t = await getT();
  const lang = await getLang();
  const rows = familyActivity(me);
  const names = Object.fromEntries(
    (db.prepare("select id, name from member where family_id = ?").all(me.family_id) as { id: string; name: string }[]).map((m) => [m.id, m.name]),
  );
  return (
    <div className="space-y-4">
      <BackHeader title={t("activity")} href="/history" />
      {rows.length === 0 ? (
        <Empty>{t("nothingYet")}</Empty>
      ) : (
        <div className="card !p-2">
          <ChangeList rows={rows} t={t} lang={lang} currency={me.currency} names={names} withEntity />
        </div>
      )}
    </div>
  );
}

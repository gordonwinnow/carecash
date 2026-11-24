import { db } from "@/lib/db";
import { getT, requireCtx } from "@/lib/ctx";
import { giveCash } from "../../../actions";
import { AmountInput, BackHeader, ChipGroup, Submit } from "@/components/ui";

/** Masters add money for a caretaker; a caretaker records money a master handed her. */
export default async function NewCash({ searchParams }: { searchParams: Promise<{ to?: string }> }) {
  const { me } = await requireCtx();
  const { to } = await searchParams;
  const t = await getT();
  const isAdmin = me.role === "admin";
  const others = db
    .prepare("select id, name from member where family_id = ? and role = ? and active = 1 order by created_at")
    .all(me.family_id, isAdmin ? "caretaker" : "admin") as { id: string; name: string }[];
  const title = isAdmin ? t("giveCash") : t("iGotMoney");
  return (
    <form action={giveCash} className="space-y-5">
      <BackHeader title={`💵 ${title}`} />
      <div>
        <div className="label">{isAdmin ? t("giveTo") : t("fromWho")}</div>
        <ChipGroup
          name="who"
          cols={2}
          initial={others.some((c) => c.id === to) ? to : others[0]?.id}
          options={others.map((c) => ({ value: c.id, label: c.name, icon: isAdmin ? "🙋" : "👑" }))}
        />
      </div>
      <AmountInput quick={[500, 1000, 2000, 3000, 5000, 10000]} />
      <div>
        <label className="label" htmlFor="note">{t("note")}</label>
        <input id="note" name="note" className="field" maxLength={200} />
      </div>
      <Submit className="btn-primary min-h-20 text-2xl" disabled={others.length === 0}>✅ {title}</Submit>
    </form>
  );
}

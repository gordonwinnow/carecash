import Link from "next/link";
import { Check, Crown, Plus, UserRound } from "lucide-react";
import { db } from "@/lib/db";
import { getT, requireCtx } from "@/lib/ctx";
import { giveCash } from "../../../actions";
import { AmountInput, BackHeader, ChipGroup, Submit } from "@/components/ui";

/** Employers add money for a caretaker; a caretaker records money an employer handed her. */
export default async function NewCash({ searchParams }: { searchParams: Promise<{ to?: string }> }) {
  const { me } = await requireCtx();
  const { to } = await searchParams;
  const t = await getT();
  const isAdmin = me.role === "admin";
  const others = db
    .prepare("select id, name from member where family_id = ? and role = ? and active = 1 order by created_at")
    .all(me.family_id, isAdmin ? "caretaker" : "admin") as { id: string; name: string }[];
  const title = isAdmin ? t("giveCash") : t("iGotMoney");
  const PersonIcon = isAdmin ? UserRound : Crown;
  // Household cash is always handed to a caretaker: with none yet, point to the invite instead of a form that can't be sent
  if (isAdmin && others.length === 0)
    return (
      <div className="space-y-6">
        <BackHeader title={title} />
        <section className="card space-y-4 py-8 text-center">
          <p className="text-lg text-muted">{t("cashNeedsCaretaker")}</p>
          <Link href="/settings?invite=caretaker#invite" className="btn-primary">
            <Plus size={24} /> {t("inviteCaretaker")}
          </Link>
        </section>
      </div>
    );
  return (
    <form action={giveCash} className="space-y-6">
      <BackHeader title={title} />
      <AmountInput autoFocus quick={[500, 1000, 2000, 3000, 5000, 10000]} />
      {others.length > 1 && (
        <div>
          <div className="label">{isAdmin ? t("giveTo") : t("fromWho")}</div>
          <ChipGroup
            name="who"
            cols={2}
            initial={others.some((c) => c.id === to) ? to : others[0]?.id}
            options={others.map((c) => ({ value: c.id, label: c.name, icon: <PersonIcon size={22} /> }))}
          />
        </div>
      )}
      {others.length === 1 && <input type="hidden" name="who" value={others[0].id} />}
      <div>
        <label className="label" htmlFor="note">{t("note")}</label>
        <input id="note" name="note" className="field" maxLength={200} />
      </div>
      <Submit className="btn-primary min-h-18 text-2xl" disabled={others.length === 0}>
        <Check size={26} strokeWidth={2.6} /> {title}
      </Submit>
    </form>
  );
}

import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import { db } from "@/lib/db";
import { getLang, getT, isOwner, requireCtx } from "@/lib/ctx";
import { day } from "@/lib/format";
import { FEEDBACK_STATUSES, type Feedback } from "@/lib/feedback";
import { reviewFeedback } from "../../../actions";
import { BackHeader, PhotoThumb, Submit } from "@/components/ui";
import { StatusPill } from "../status";

/** For the app's owners (OWNER_EMAILS): every piece of feedback, open ones first, each with a status and a reply. */
export default async function ReviewFeedback() {
  const { user } = await requireCtx();
  if (!isOwner(user)) redirect("/feedback");
  const t = await getT();
  const lang = await getLang();
  const rows = db
    .prepare(
      `select f.*, fam.name as family from feedback f left join family fam on fam.id = f.family_id
       order by case when f.status in ('done','declined') then 1 else 0 end, f.created_at desc limit 300`,
    )
    .all() as (Feedback & { family: string | null })[];

  return (
    <div className="space-y-4">
      <BackHeader title={t("reviewFeedback")} href="/feedback" />
      {rows.map((f) => (
        <form key={f.id} action={reviewFeedback.bind(null, f.id)} className="card space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="min-w-0 truncate text-base font-bold">
              {f.name ?? "—"} <span className="font-medium text-muted">· {f.family ?? "—"} · {day(f.created_at, lang)}</span>
            </span>
            <StatusPill status={f.status} t={t} />
          </div>
          <p className="whitespace-pre-wrap break-words text-base">{f.body}</p>
          {f.photo && <PhotoThumb name={f.photo} size={72} />}
          <div className="flex flex-wrap gap-2">
            {FEEDBACK_STATUSES.map((s) => (
              <label key={s} className="cursor-pointer">
                <input type="radio" name="status" value={s} defaultChecked={f.status === s} className="peer sr-only" />
                <span className="block rounded-full bg-sunk px-3 py-1.5 text-sm font-bold text-muted peer-checked:bg-accent peer-checked:text-on-accent">{t(`fb_${s}` as never)}</span>
              </label>
            ))}
          </div>
          <textarea name="reply" rows={2} defaultValue={f.reply ?? ""} placeholder={t("reply")} className="field min-h-20 resize-y py-2.5" />
          <Submit className="btn-tint min-h-12 text-base">
            <Check size={20} /> {t("save")}
          </Submit>
        </form>
      ))}
    </div>
  );
}

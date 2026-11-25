import Link from "next/link";
import { Check, Send } from "lucide-react";
import { db } from "@/lib/db";
import { getLang, getT, isOwner, requireCtx } from "@/lib/ctx";
import { day } from "@/lib/format";
import type { Feedback } from "@/lib/feedback";
import { sendFeedback } from "../../actions";
import { BackHeader, PhotoInput, PhotoThumb, Submit } from "@/components/ui";
import { StatusPill } from "./status";

/** Send a feature request or a problem, and follow what happened to everything you sent. */
export default async function FeedbackPage({ searchParams }: { searchParams: Promise<{ sent?: string }> }) {
  const { user } = await requireCtx();
  const { sent } = await searchParams;
  const t = await getT();
  const lang = await getLang();
  const mine = db.prepare("select * from feedback where user_id = ? order by created_at desc").all(user.id) as Feedback[];

  return (
    <div className="space-y-6">
      <BackHeader title={t("feedback")} href="/settings" />

      {sent && (
        <p className="flex items-center gap-2 rounded-2xl bg-good-soft px-4 py-3 text-base font-semibold text-good">
          <Check size={20} /> {t("feedbackSent")}
        </p>
      )}

      <form action={sendFeedback} className="space-y-3">
        <label className="label" htmlFor="body">{t("feedbackHint")}</label>
        <textarea id="body" name="body" rows={5} maxLength={4000} required className="field min-h-36 resize-y py-3 leading-relaxed" placeholder={t("feedbackPlaceholder")} />
        <PhotoInput big={false} label={t("addScreenshot")} camera={false} />
        <Submit className="btn-primary min-h-16 text-xl">
          <Send size={22} /> {t("send")}
        </Submit>
      </form>

      {mine.length > 0 && (
        <section className="space-y-3">
          <h2 className="px-1 text-lg font-extrabold">{t("myFeedback")}</h2>
          {mine.map((f) => (
            <article key={f.id} className="card space-y-3">
              <div className="flex items-center justify-between gap-3">
                <StatusPill status={f.status} t={t} />
                <span className="text-sm text-muted">{day(f.created_at, lang)}</span>
              </div>
              <p className="whitespace-pre-wrap break-words text-base">{f.body}</p>
              {f.photo && <PhotoThumb name={f.photo} size={72} />}
              {f.reply && (
                <div className="rounded-2xl bg-sunk px-4 py-3">
                  <div className="mb-1 text-sm font-bold text-muted">{t("reply")} · {day(f.updated_at, lang)}</div>
                  <p className="whitespace-pre-wrap break-words text-base">{f.reply}</p>
                </div>
              )}
            </article>
          ))}
        </section>
      )}

      {isOwner(user) && (
        <>
          <Link href="/feedback/review" className="btn-tint">{t("reviewFeedback")}</Link>
          <Link href="/stats" className="btn-tint">Growth 成長</Link>
        </>
      )}
    </div>
  );
}

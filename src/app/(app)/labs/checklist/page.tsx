import Link from "next/link";
import { AlertTriangle, CalendarDays, Check, ExternalLink, Phone } from "lucide-react";
import { db } from "@/lib/db";
import { getLang, getT, requireLabs } from "@/lib/ctx";
import { today } from "@/lib/format";
import { ITEMS, buildChecklist, descKey, titleKey, type Dates, type Item, type Status } from "@/lib/labs";
import type { Key, T } from "@/lib/i18n";
import { saveCaretakerDates, toggleChecklist } from "../../../actions";
import { ActionButton, BackHeader, Submit } from "@/components/ui";
import { LabsTag } from "@/components/labs";

type Caretaker = { id: string } & Dates & { name: string };

export default async function Checklist({ searchParams }: { searchParams: Promise<{ m?: string }> }) {
  const sp = await searchParams;
  const { me } = await requireLabs();
  const t = await getT();
  const lang = await getLang();
  const caretakers = db
    .prepare("select id, name, arrival_date, contract_start, arc_expiry from member where family_id = ? and role = 'caretaker' and active = 1 order by created_at")
    .all(me.family_id) as Caretaker[];
  const who = caretakers.find((c) => c.id === sp.m) ?? caretakers[0];

  return (
    <div className="space-y-6">
      <BackHeader title={t("labsChecklist")} href="/more" />
      <p className="flex items-start gap-2 rounded-2xl bg-warn-soft p-4 text-[15px] font-semibold">
        <span className="pt-0.5"><LabsTag /></span>
        <span>{t("labsDisclaimer")}</span>
      </p>

      {!who ? (
        <div className="card space-y-3 text-center">
          <p className="text-lg font-bold">{t("noCaretaker")}</p>
          <p className="text-muted">{t("noCaretakerHint")}</p>
          <Link href="/settings?invite=caretaker" className="btn-tint">{t("inviteCaretaker")}</Link>
        </div>
      ) : (
        <Body t={t} lang={lang} who={who} caretakers={caretakers} familyId={me.family_id} />
      )}

      <p className="flex items-center justify-center gap-2 text-center text-[15px] text-muted">
        <Phone size={16} /> {t("clHotline")}
      </p>
    </div>
  );
}

function Body({ t, lang, who, caretakers, familyId }: { t: T; lang: string; who: Caretaker; caretakers: Caretaker[]; familyId: string }) {
  const done = new Map(
    (db.prepare("select item_key, period, done_at from checklist_done where family_id = ? and member_id = ?").all(familyId, who.id) as { item_key: string; period: string; done_at: number }[]).map(
      (r) => [`${r.item_key}|${r.period}`, r.done_at],
    ),
  );
  const items = buildChecklist(who, today(), done);
  const by = (s: Status) => items.filter((i) => i.status === s);
  const sections: { status: Status; title: Key }[] = [
    { status: "overdue", title: "clOverdue" },
    { status: "soon", title: "clSoon" },
    { status: "later", title: "clLater" },
    { status: "done", title: "clDone" },
  ];
  const day = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString(lang, { year: "numeric", month: "short", day: "numeric" });

  return (
    <>
      {caretakers.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {caretakers.map((c) => (
            <Link key={c.id} href={`/labs/checklist?m=${c.id}`} className={`rounded-full px-4 py-2 text-base font-bold ${c.id === who.id ? "bg-accent text-white" : "bg-card [box-shadow:var(--shadow)]"}`}>
              {c.name}
            </Link>
          ))}
        </div>
      )}

      <details className="card" open={!who.arrival_date}>
        <summary className="flex cursor-pointer items-center gap-2.5 text-lg font-extrabold">
          <span className="badge h-9 w-9 rounded-xl"><CalendarDays size={20} /></span>
          {t("clDates")} · {who.name}
        </summary>
        <form action={saveCaretakerDates.bind(null, who.id)} className="mt-4 space-y-3">
          {!who.arrival_date && <p className="text-base font-semibold text-warn">{t("clNeedDates")}</p>}
          {(
            [
              ["arrival_date", "clArrival"],
              ["contract_start", "clContractStart"],
              ["arc_expiry", "clArcExpiry"],
            ] as const
          ).map(([name, label]) => (
            <div key={name}>
              <label className="label" htmlFor={name}>{t(label)}</label>
              <input id={name} name={name} type="date" className="field" defaultValue={who[name] ?? ""} />
            </div>
          ))}
          <Submit className="btn-tint">{t("save")}</Submit>
        </form>
      </details>

      {items.every((i) => i.status === "done" || i.status === "later") && (
        <p className="rounded-2xl bg-good-soft p-4 text-center text-lg font-bold text-good">{t("clAllClear")}</p>
      )}

      {sections.map(({ status, title }) => {
        const list = by(status);
        if (!list.length) return null;
        return (
          <section key={status} className="space-y-2">
            <h2 className={`flex items-center gap-2 px-1 text-lg font-extrabold ${status === "overdue" ? "text-bad" : ""}`}>
              {status === "overdue" && <AlertTriangle size={20} />}
              {t(title)} <span className="text-muted">· {list.length}</span>
            </h2>
            <ul className="space-y-2">
              {list.map((i) => (
                <Row key={`${i.key}|${i.period}`} item={i} t={t} due={day(i.due)} memberId={who.id} />
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}

const GROUP: Record<Item["group"], Key> = { monthly: "clMonthly", quarterly: "clQuarterly", once: "clOnce", periodic: "clPeriodic" };

function Row({ item, t, due, memberId }: { item: Item; t: T; due: string; memberId: string }) {
  const isDone = item.status === "done";
  const period = /^\d{4}-\d{2}$/.test(item.period) ? ` · ${item.period}` : /Q\d$/.test(item.period) ? ` · ${item.period.replace("Q", " Q")}` : "";
  return (
    <li className={`card space-y-2 !p-4 ${isDone ? "opacity-60" : ""}`}>
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="text-[13px] font-bold text-muted">{t(GROUP[item.group])}{period}</div>
          <div className={`text-lg font-bold leading-snug ${isDone ? "line-through" : ""}`}>{t(titleKey(item.key))}</div>
          <div className={`text-[15px] font-semibold ${item.status === "overdue" ? "text-bad" : item.status === "soon" ? "text-warn" : "text-muted"}`}>
            {t("clDue", { date: due })}
          </div>
        </div>
        <ActionButton
          action={toggleChecklist.bind(null, memberId, item.key, item.period)}
          className={`flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-4 text-base font-bold ${isDone ? "bg-sunk text-muted" : "bg-good-soft text-good"}`}
        >
          {isDone ? t("clUndo") : <><Check size={18} strokeWidth={2.6} /> {t("clMarkDone")}</>}
        </ActionButton>
      </div>
      {!isDone && (
        <>
          <p className="text-[15px] leading-relaxed text-muted">{t(descKey(item.key))}</p>
          <a href={ITEM_LINK(item)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[15px] font-bold text-accent">
            {t("clSource")} <ExternalLink size={14} />
          </a>
        </>
      )}
    </li>
  );
}

const ITEM_LINK = (i: Item) => ITEMS[i.key].link;

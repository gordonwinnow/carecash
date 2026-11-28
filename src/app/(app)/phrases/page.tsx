import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { getLang, getT, requireCtx, type Member } from "@/lib/ctx";
import { CARETAKER_PHRASES, EMPLOYER_PHRASES, PHRASE_LANG_LABEL, PHRASE_LANGS, isPhraseLang, type PhraseLang } from "@/lib/phrases";
import { PhraseList } from "./show";

/** The caregiver's language: her last notification-device language if it is one we have phrases in, else Indonesian. */
function guessLang(c: Member | undefined): PhraseLang {
  if (!c) return "id";
  const row = db.prepare("select lang from push_sub where user_id = ? order by created_at desc limit 1").get(c.user_id) as { lang: string } | undefined;
  return isPhraseLang(row?.lang) ? row.lang : "id";
}

/**
 * Money phrases for the moment cash changes hands.
 * Employer: her language big, Chinese small, with a language switch. Caregiver: Chinese big for the employer, her language small.
 */
export default async function Phrases({ searchParams }: { searchParams: Promise<{ for?: string; l?: string; first?: string }> }) {
  const { me } = await requireCtx();
  const t = await getT();
  const lang = await getLang();
  const sp = await searchParams;

  if (me.role === "caretaker") {
    const mine: PhraseLang = isPhraseLang(lang) ? lang : "en";
    return (
      <div className="space-y-5">
        <Header title={t("showEmployer")} hint={t("showEmployerHint")} />
        <PhraseList bigLang="zh-TW" close={t("tapToClose")} lines={CARETAKER_PHRASES.map((p) => ({ key: p.key, big: p.zh, small: p[mine] }))} />
      </div>
    );
  }

  const caretakers = db
    .prepare("select * from member where family_id = ? and role = 'caretaker' and active = 1 order by created_at")
    .all(me.family_id) as Member[];
  const her = caretakers.find((c) => c.id === sp.for) ?? caretakers[0];
  const target: PhraseLang = isPhraseLang(sp.l) ? sp.l : guessLang(her);
  const phrases = sp.first ? EMPLOYER_PHRASES.filter((p) => p.first) : EMPLOYER_PHRASES;
  const q = (l: string, first = !!sp.first) => `/phrases?${new URLSearchParams({ ...(her ? { for: her.id } : {}), l, ...(first ? { first: "1" } : {}) })}`;

  return (
    <div className="space-y-5">
      <Header title={t("phrasesTitle")} hint={t("phrasesHint")} />
      {/* Her language: a guess from her phone, easy to change */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-muted">{t("herLanguage")}</span>
        {PHRASE_LANGS.map((l) => (
          <Link
            key={l}
            href={q(l)}
            replace
            className={`rounded-full px-3 py-1.5 text-sm font-bold ${l === target ? "bg-accent text-on-accent" : "bg-card [box-shadow:var(--shadow)]"}`}
          >
            {PHRASE_LANG_LABEL[l]}
          </Link>
        ))}
      </div>
      <PhraseList bigLang={target} close={t("tapToClose")} lines={phrases.map((p) => ({ key: p.key, big: p[target], small: p.zh }))} />
      {sp.first && (
        <Link href={q(target, false)} className="block text-center text-base font-semibold text-accent">
          {t("allPhrases")}
        </Link>
      )}
    </div>
  );
}

function Header({ title, hint }: { title: string; hint: string }) {
  return (
    <header className="space-y-2 pt-2">
      <Link href="/home" className="inline-flex items-center gap-1 text-base font-semibold text-muted">
        <ArrowLeft size={18} />
      </Link>
      <h1 className="text-2xl font-extrabold">{title}</h1>
      <p className="text-base text-muted">{hint}</p>
    </header>
  );
}

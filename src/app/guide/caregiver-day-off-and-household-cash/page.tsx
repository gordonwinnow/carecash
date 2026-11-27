import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { SiteFooter, SiteHeader } from "../../landing";

const A = {
  slug: "caregiver-day-off-and-household-cash",
  title: "看護休假那天，家用金、三餐、照顧怎麼安排",
  description:
    "外籍看護放假那天，家用金誰拿？長輩的三餐和照顧誰接手？整理休假前要講好的事、家用金的兩種交接方式、替代照顧與 1966 喘息服務，以及為什麼休假不該扣薪。",
  published: "2026-11-27",
};

export const metadata: Metadata = {
  title: `${A.title}｜CareCash 家用金`,
  description: A.description,
  alternates: { canonical: `/guide/${A.slug}` },
  openGraph: { title: A.title, description: A.description, type: "article", locale: "zh_TW", publishedTime: A.published, images: [{ url: "/icon-1024.png" }] },
};

const H2 = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2 id={id} className="mt-12 scroll-mt-6 text-2xl font-extrabold">{children}</h2>
);
const P = ({ children }: { children: React.ReactNode }) => <p className="mt-4 text-lg leading-8">{children}</p>;
const A_ = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="font-bold text-accent-ink underline underline-offset-4">{children}</Link>
);

const BEFORE = [
  ["哪一天、幾點到幾點", "幾點出門、幾點回來、會不會外宿，前幾天就確認好，不要當天早上才問。"],
  ["誰來照顧長輩", "哪位家人接手、從幾點開始；家人沒辦法的話，要提早安排替代照顧。"],
  ["家用金怎麼處理", "錢留在她身上，還是交給接手的家人？先講好，回來時才對得起來。"],
];

const OPTIONS = [
  {
    name: "做法一：家用金留在看護身上，家人當天自己出錢",
    how: "看護休假那天，家用金照樣由她保管，不動它。接手的家人如果要買菜、買尿布，用自己的錢付，不記在看護的帳上。",
    fit: "只休一天、當天花費不多的家庭。最簡單，帳不會亂。",
    note: "家人那天的花費如果要算進家裡的總開銷，另外記一筆「家人自付」，不要混進看護的家用金。",
  },
  {
    name: "做法二：出門前點清，交給接手的家人",
    how: "看護出門前，和接手的家人一起點清手上的家用金，雙方確認金額，再交給家人用。回來後，家人把剩下的錢和收據交回，再點一次。",
    fit: "休假好幾天，或家人要用這筆錢買比較多東西的情況。",
    note: "交出去、交回來都要點清、確認。這幾天的支出由家人負責記帳、留收據，不是看護的責任。",
  },
];

const FAQ = [
  {
    q: "看護休假那天，可以扣薪水嗎？",
    a: "依勞動契約約定的休息日、休假，原則上不應該因此扣薪。休假怎麼安排、休息日若請她出勤要怎麼給工資或補休，都以契約與勞動部規定為準；不確定的話，問仲介或撥 1955 專線。",
  },
  {
    q: "休假那天，看護可以用家用金買自己的東西嗎？",
    a: "不行，這對雙方都比較清楚。家用金是家裡的錢，用在被看護者和家裡的生活所需；她休假外出的花費是她自己的。出門前講清楚，可以避免誤會。",
  },
  {
    q: "休假那天，看護的伙食費怎麼算？",
    a: "看你們的契約怎麼約定。有的家庭照樣提供伙食或照給伙食費，有的另有約定。重點是事先講好，不要事後才說「那天沒在家吃，所以少給」。",
  },
  {
    q: "家人都沒空，看護休假時誰來照顧？",
    a: "可以撥 1966 長照專線，詢問喘息服務或其他替代照顧方式。是否符合資格、可以用幾天，依長照評估結果與相關規定而定，越早詢問越好。",
  },
  {
    q: "看護說休假不想出門，可以請她順便照顧嗎？",
    a: "休息日就是讓她休息的。如果她自己願意在休息日工作，要依契約與勞動部規定給加班費或補休，並記錄清楚；不要因為她在家，就默認她在上班。",
  },
];

export default function ArticlePage() {
  const url = `${SITE_URL}/guide/${A.slug}`;
  return (
    <div className="min-h-dvh bg-bg">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 pb-12 pt-4">
        <nav className="text-sm text-muted">
          <Link href="/guide" className="underline-offset-4 hover:underline">家用金指南</Link>
        </nav>
        <article>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">{A.title}</h1>
          <p className="mt-3 text-sm text-muted">發布於 {A.published}・約 6 分鐘閱讀</p>

          <P>
            看護每天陪著長輩，休假那天是她難得可以見朋友、上教會或清真寺、處理自己事情的日子。可是對家裡來說，那一天突然少了一個人：長輩的三餐誰煮？吃藥誰提醒？她手上的家用金要不要交出來？
          </P>
          <P>
            這些事如果都等到當天早上才想，很容易手忙腳亂，休假回來還可能對不起帳。下面整理<strong>休假前要講好的事、家用金怎麼交接、三餐和照顧怎麼安排</strong>，以及一個很重要的原則：休假不是扣錢的理由。
          </P>

          <H2 id="before">休假前，先講好三件事</H2>
          <div className="mt-4 space-y-3">
            {BEFORE.map(([t, d]) => (
              <div key={t} className="card">
                <p className="text-lg font-bold">{t}</p>
                <p className="mt-2 text-[17px] leading-7 text-muted">{d}</p>
              </div>
            ))}
          </div>
          <P>
            休息日怎麼安排、多久一次，<strong>依勞動契約與勞動部規定</strong>。最好在她剛來的第一週就講清楚，之後固定下來，雙方都好安排。可以參考{" "}
            <A_ href="/guide/first-week-with-new-caregiver">看護來了！第一週清單</A_>。
          </P>

          <H2 id="cash">休假那天，家用金誰拿？</H2>
          <P>最常見的兩種做法，選一種，事先講好就好：</P>
          <div className="mt-4 space-y-4">
            {OPTIONS.map((o) => (
              <div key={o.name} className="card">
                <p className="text-xl font-extrabold">{o.name}</p>
                <p className="mt-3 text-[17px] leading-7"><span className="font-bold">怎麼做：</span>{o.how}</p>
                <p className="mt-2 text-[17px] leading-7"><span className="font-bold">適合：</span>{o.fit}</p>
                <p className="mt-2 text-[17px] leading-7"><span className="font-bold">注意：</span>{o.note}</p>
              </div>
            ))}
          </div>
          <P>
            不管哪一種，有兩件事不要做：一是<strong>家人用了看護的家用金卻沒留收據</strong>，她回來後帳對不起來，卻要她解釋；二是<strong>讓她休假前自己先墊錢</strong>，例如先替家人買好幾天的菜。需要先採買的話，就先補足週轉金。先墊錢的風險，請看{" "}
            <A_ href="/guide/caregiver-pays-first-reimbursement">看護先墊錢怎麼辦？</A_>。
          </P>

          <H2 id="meals">長輩的三餐怎麼安排</H2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-lg leading-8">
            <li><strong>前一天先備好：</strong>可以請看護在工作時間內，把隔天的菜洗好、切好，或煮好一兩樣放冰箱，家人加熱就好。</li>
            <li><strong>寫一張餐食小卡：</strong>長輩吃什麼、不能吃什麼、要不要切碎或打成泥、喝水量。家人照著做就不會出錯。</li>
            <li><strong>外食或訂餐：</strong>家人不方便煮的話，買便當或用外送也可以。這筆錢由家人自己出，或另外記一筆，不要記在看護的帳上。</li>
          </ul>

          <H2 id="care">照顧誰接手：替代照顧的選擇</H2>
          <P>照顧比三餐更需要事先交接。請看護在休假前，和接手的人一起過一次：</P>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-lg leading-8">
            <li>吃藥的時間和份量，藥放在哪裡。</li>
            <li>翻身、換尿布、上廁所、洗澡的時間和方法。</li>
            <li>長輩不舒服時的徵兆，以及醫院、診所、緊急聯絡人的電話。</li>
          </ul>
          <P>
            接手的人可以是兄弟姊妹輪流，也可以是其他替代照顧。家人都沒辦法的話，可以撥 <strong>1966 長照專線</strong>，詢問喘息服務或其他替代照顧方式；是否符合資格、可以用幾天，依長照評估結果與相關規定而定。兄弟姊妹怎麼輪、費用怎麼分，可以參考{" "}
            <A_ href="/guide/siblings-sharing-parent-care-costs">兄弟姊妹分攤爸媽的看護費、家用金</A_>。
          </P>

          <H2 id="salary">休假不扣薪，也不扣家用金</H2>
          <P>
            依契約約定的休息日和休假，是她應有的休息，<strong>原則上不應該因為休假而扣薪水</strong>。如果休息日請她出勤，要依勞動契約與勞動部規定給工資或補休，並清楚記在薪資紀錄上。
          </P>
          <P>
            同樣地，也不要把休假和家用金混在一起：不要因為她休假，就要她用自己的錢補家用金的差額；休假那天家人花的錢，也不是她的帳。休假、加班和工資怎麼算有疑問，請問仲介，或撥勞動部 <strong>1955 專線</strong>（免費、24 小時、有多種語言服務）。
          </P>

          <H2 id="after">休假回來：花 5 分鐘對一次帳</H2>
          <P>
            她回來那天，一起看一下家用金：<strong>出門前剩多少＋這幾天補的錢－這幾天花的錢＝現在手上的錢</strong>。如果是做法二，家人把剩下的錢和收據交回、雙方點清。小差額不用追究太久，重點是把習慣建立起來，下次休假就更順。
          </P>

          <H2 id="faq">常見問題</H2>
          <div className="mt-4 space-y-3">
            {FAQ.map((f) => (
              <div key={f.q} className="card">
                <p className="text-lg font-bold">{f.q}</p>
                <p className="mt-2 text-[17px] leading-7 text-muted">{f.a}</p>
              </div>
            ))}
          </div>

          <P>
            過年、開齋節這類長假怎麼安排，請看{" "}
            <A_ href="/guide/lunar-new-year-caregiver-holiday-money">過年請外籍看護：放假、紅包、加班費與家用金怎麼安排</A_>。
          </P>

          <div className="card mt-12 p-6 text-center">
            <p className="text-2xl font-extrabold">她休假，帳也不會亂</p>
            <p className="mt-3 text-lg text-muted">
              CareCash 家用金：交錢、收錢雙方確認，每筆支出附收據照片，餘額自動算好；兄弟姊妹一起看同一本帳，誰接手都清楚。
            </p>
            <div className="mx-auto mt-5 max-w-xs">
              <Link href="/sign-in?mode=signup&ref=guide-dayoff" className="btn-primary">免費開始使用</Link>
            </div>
          </div>

          <p className="mt-10 text-sm text-muted">
            本文為一般性的生活建議，不構成法律意見；休息日、休假、出勤工資與伙食的約定，請以勞動契約、勞動部規定及您的仲介說明為準，不確定時可撥 1955 專線詢問；替代照顧與喘息服務的資格，請洽 1966 長照專線。
          </p>
        </article>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Article",
              headline: A.title,
              description: A.description,
              datePublished: A.published,
              dateModified: A.published,
              inLanguage: "zh-TW",
              mainEntityOfPage: url,
              publisher: { "@type": "Organization", name: "CareCash 家用金", logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` } },
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            },
          ]),
        }}
      />
    </div>
  );
}

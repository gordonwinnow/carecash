import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { SiteFooter, SiteHeader } from "../../landing";
import { article } from "../articles";
import { RelatedArticles } from "../related";
import { ShareArticle } from "../share";

const A = article("caregiver-pays-first-reimbursement")!;

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

const RISKS = [
  ["她的錢很緊", "看護的薪水多半要寄回家鄉養家，不少人來台前也有借款要還。手上能動用的錢不多，墊一次就可能影響她寄錢回家。"],
  ["損失都落在她身上", "收據不見、忘記報帳、金額有爭議，最後吃虧的是先出錢的人。她又是比較不敢開口的一方。"],
  ["她會不敢買", "怕墊了錢拿不回來，她可能該買的不買，長輩需要的東西就這樣拖著。"],
  ["關係變得尷尬", "每次報帳都像在跟雇主要錢，次數一多，雙方都不舒服。"],
];

const PREVENT = [
  ["週轉金用完了還沒補", "約定一條「該補錢的線」，例如剩不到一定金額就通知你，你在一兩天內補齊。補錢時間固定，她就不用不好意思開口。"],
  ["長輩臨時要看病、買藥", "家裡另外放一小筆「急用金」，和家用金分開，只在看病、買藥這種情況用，用了再補。"],
  ["雇主出差、聯絡不到", "出門前多給一些週轉金，並告訴她聯絡不到你時可以找哪位家人。兄弟姊妹之間先說好誰當備援。"],
  ["大筆東西剛好要買", "尿布、營養品、家電這類較大的支出，盡量由雇主自己買或網購送到家，不要讓她用週轉金或自己的錢買。"],
];

const RULES = [
  { t: "1. 先講好上限", d: "例如「一次最多墊 500 元，超過先打電話問我」。上限依你家的情況定，重點是事先說好，她才知道什麼情況可以墊、什麼情況要先問。" },
  { t: "2. 當天或隔天就還", d: "她墊了錢，最晚隔天就還，不要等到月底。家人不在家時，可以用轉帳，或請同住的家人先還。拖得越久，越容易忘、越容易對不上。" },
  { t: "3. 每筆都要有紀錄", d: "拍收據、寫下買了什麼、多少錢、哪一天。沒有收據的菜攤，就自己記一筆。還錢時雙方確認金額。" },
  { t: "4. 每週固定對帳", d: "固定一天把這週的帳看一次：給了多少、花了多少、手上剩多少、她墊了多少。墊的錢在這天之前一定要還清。" },
  { t: "5. 不從薪水抵", d: "還她墊的錢，和薪水分開處理。不要說「月底跟薪水一起算」，也不要拿家用金的差額去扣薪水。" },
];

const STEPS = [
  ["週一", "給週轉金 2,000 元", "餘額 2,000"],
  ["週三", "買菜、日用品共 1,600 元", "餘額 400"],
  ["週四", "長輩的尿布、藥膏 650 元", "餘額 −250"],
  ["週四晚上", "雇主補 250 元還她，再補週轉金到 2,000", "餘額 2,000"],
];

const FAQ = [
  {
    q: "完全不讓看護墊錢，可能嗎？",
    a: "可以。最好的方法是給一筆固定週轉金，剩到一定金額就補，她手上一直有錢可以用，自然就不用墊。偶爾臨時需要，再照「上限＋當天還」的原則處理。",
  },
  {
    q: "她墊的錢，可以月底跟薪水一起給嗎？",
    a: "不建議。墊的錢是家裡欠她的，和薪水是兩回事，混在一起很容易算錯，也可能讓薪水的金額看起來不清楚。墊多少就當天或隔天還多少，薪水依勞動契約與勞動部規定另外給付。",
  },
  {
    q: "她墊錢買的東西沒有收據怎麼辦？",
    a: "傳統市場、菜攤常常沒有收據。請她當場記下買了什麼、多少錢，可以拍一下商品照片。雇主要相信合理範圍內的紀錄，不要因為沒有收據就不還。",
  },
  {
    q: "帳對不起來，可以從她的薪水扣嗎？",
    a: "不要自行從薪水扣錢。帳對不上時，先一起看收據和紀錄找原因，多半是漏記或找零算錯。真的有爭議，依契約與勞動部規定處理，不確定問仲介或撥 1955 專線。",
  },
  {
    q: "餘額顯示負數是什麼意思？",
    a: "代表她花的錢比你給的還多，差額是她自己先墊的，也就是家裡欠她的錢。看到負數，就盡快把差額還她，再把週轉金補回原本的金額；如果常常變負數，代表週轉金給得太少，可以調高。",
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
          <p className="mt-3 text-sm text-muted">發布於 {A.published}・約 7 分鐘閱讀</p>

          <P>
            週轉金剛好用完、長輩突然需要買藥、雇主出差聯絡不到，看護只好拿自己的錢先付。這種「先墊後報」在很多家庭都發生過，雇主常常沒感覺，但對看護來說，壓力比你想像的大。這篇說明<strong>為什麼先墊對她有風險</strong>、真的要墊時<strong>怎麼做才公平</strong>，以及帳上<strong>餘額變成負數</strong>時該怎麼處理。
          </P>

          <H2 id="risks">為什麼先墊錢對看護有風險？</H2>
          <div className="mt-4 space-y-3">
            {RISKS.map(([name, desc]) => (
              <div key={name} className="card">
                <p className="text-lg font-bold">{name}</p>
                <p className="mt-2 text-[17px] leading-7 text-muted">{desc}</p>
              </div>
            ))}
          </div>
          <P>
            所以，<strong>先墊後報不適合當成常態</strong>。比較好的做法是給一筆固定週轉金，讓她手上一直有錢；先墊只用在臨時、小額、事前說好的情況。各種給錢方式的比較，可以看{" "}
            <Link href="/guide/how-employers-give-grocery-money" className="font-bold text-accent-ink underline underline-offset-4">家庭移工買菜怎麼給錢？6 種常見方式比較</Link>。
          </P>

          <H2 id="when">最常發生先墊的四種情況，怎麼預防</H2>
          <div className="mt-4 space-y-3">
            {PREVENT.map(([name, desc]) => (
              <div key={name} className="card">
                <p className="text-lg font-bold">{name}</p>
                <p className="mt-2 text-[17px] leading-7 text-muted">{desc}</p>
              </div>
            ))}
          </div>

          <H2 id="rules">真的要墊：五個公平原則</H2>
          <div className="mt-4 space-y-3">
            {RULES.map((r) => (
              <div key={r.t} className="card">
                <p className="text-lg font-bold">{r.t}</p>
                <p className="mt-2 text-[17px] leading-7 text-muted">{r.d}</p>
              </div>
            ))}
          </div>
          <P>
            這五個原則最好在一開始就講清楚，寫進家規表裡，翻譯成她的語言。剛請看護的家庭，可以參考{" "}
            <Link href="/guide/first-week-with-new-caregiver" className="font-bold text-accent-ink underline underline-offset-4">看護來了！第一週清單</Link>。
          </P>

          <H2 id="negative">餘額變成負數，代表什麼？</H2>
          <P>
            用週轉金記帳時，有一條很簡單的公式：<strong>給的錢 − 花掉的錢 ＝ 她手上剩的錢</strong>。正常情況下，這個數字是正的。如果變成<strong>負數</strong>，意思是她花的比你給的多，差額就是她自己先墊的錢，也就是<strong>家裡欠她的錢</strong>。
          </P>
          <P>下面是一個例子（金額只是舉例）：</P>
          <div className="mt-4 space-y-3">
            {STEPS.map(([day, what, bal]) => (
              <div key={day} className="card">
                <p className="text-lg font-bold">{day}</p>
                <p className="mt-2 text-[17px] leading-7">{what}</p>
                <p className="mt-1 text-[17px] font-bold leading-7 text-accent-ink">{bal}</p>
              </div>
            ))}
          </div>
          <P>
            週四餘額變成 −250，代表她自己墊了 250 元。雇主當天就把 250 元還她，再把週轉金補回 2,000 元，帳就乾淨了。
          </P>
          <P>看到負數時，記得三件事：</P>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-lg leading-8">
            <li><strong>先還錢</strong>：負多少就還多少，當天或隔天就處理，雙方確認。</li>
            <li><strong>不要責怪她</strong>：負數通常是因為臨時要買的東西，不是她亂花。先一起看收據。</li>
            <li><strong>常常負數就調高週轉金</strong>：如果每週都不夠，代表金額給太少，不是她的問題。</li>
          </ul>
          <P>
            一個月大概要準備多少週轉金，可以參考{" "}
            <Link href="/guide/caregiver-food-and-household-cash-per-month" className="font-bold text-accent-ink underline underline-offset-4">外籍看護伙食費、家用金一個月多少？</Link>。
          </P>

          <H2 id="weekly">每週對帳：讓墊的錢不會累積</H2>
          <P>
            固定每週一天，花五分鐘一起看帳：這週給了多少、花了多少、手上剩多少、有沒有她墊的錢還沒還。每次都把墊的錢還清、把週轉金補回原本的金額，就不會有「上個月好像還欠她一點」的模糊帳。
          </P>
          <P>
            如果爸媽的看護由兄弟姊妹一起負責，更要講好<strong>誰負責還她墊的錢</strong>，不要讓她一個一個去問。可以固定由一個人處理，其他人再分攤，請看{" "}
            <Link href="/guide/siblings-sharing-parent-care-costs" className="font-bold text-accent-ink underline underline-offset-4">兄弟姊妹分攤爸媽的看護費、家用金</Link>。更完整的記帳方法，請看{" "}
            <Link href="/guide/household-cash-for-caregivers" className="font-bold text-accent-ink underline underline-offset-4">第一次請外籍看護：家用金怎麼給、怎麼記帳</Link>。
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

          <div className="card mt-12 p-6 text-center">
            <p className="text-2xl font-extrabold">她墊了多少，一眼就看得到</p>
            <p className="mt-3 text-lg text-muted">
              CareCash 家用金：看護用印尼文、越南文等母語拍收據記帳，給錢、補錢雙方確認，餘額自動算好，兄弟姊妹也能一起看。
            </p>
            <div className="mx-auto mt-5 max-w-xs">
              <Link href="/sign-in?mode=signup&ref=guide-reimburse" className="btn-primary">免費開始使用</Link>
            </div>
            <Link href="/sign-in#demo" className="mt-3 inline-block text-base font-semibold text-accent-ink underline underline-offset-4">先不註冊，試用範例家庭</Link>
          </div>

          <ShareArticle url={`${SITE_URL}/guide/${A.slug}?ref=share`} title={A.title} />

          <RelatedArticles current={A.slug} />

          <p className="mt-10 text-sm text-muted">
            本文為一般性的生活建議，不構成法律意見；薪資、伙食與工作內容的約定，請以勞動契約、勞動部規定及您的仲介說明為準，不確定時可撥 1955 專線詢問。
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
              dateModified: A.updated ?? A.published,
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

import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { SiteFooter, SiteHeader } from "../../landing";
import { RelatedArticles } from "../related";
import { ShareArticle } from "../share";

const A = {
  slug: "hiring-foreign-caregiver-costs-overview",
  title: "請外籍看護一個月要花多少？費用總覽與準備清單",
  description:
    "準備請外籍家庭看護，每個月要花哪些錢？整理薪資、就業安定費、健保、保險、仲介服務費、伙食住宿、家用金與健檢等費用，附官方來源、開始前的準備清單與常見問題。",
  published: "2026-11-27",
  updated: undefined as string | undefined,
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
const Src = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} className="text-accent-ink underline underline-offset-4" rel="noopener" target="_blank">{children}</a>
);

type Cost = { n: number; name: string; what: string; amount: React.ReactNode; note: string };

const COSTS: Cost[] = [
  {
    n: 1,
    name: "薪資（每月固定）",
    what: "看護的經常性薪資，每月依契約約定的日期給付。",
    amount: (
      <>
        勞動部自 2022 年 8 月 10 日起，新聘、期滿續聘與轉換雇主的家事移工（含家庭看護工），月薪調整為新台幣 20,000 元；同一雇主續聘滿 3 年，建議再加 1,000 元（
        <Src href="https://www.wda.gov.tw/News_Content.aspx?n=31&s=4149">勞動力發展署公告</Src>
        ）。這個金額不含加班費和三節、年終等非經常性給與。
      </>
    ),
    note: "休假日如果請她工作，依契約約定另給加班費；實際金額以你們簽的勞動契約為準。薪水按時、足額給，不要拿家用金、伙食費去抵薪水。",
  },
  {
    n: 2,
    name: "就業安定費（每季繳）",
    what: "雇主聘僱外籍看護，依法要繳給政府的費用，按季計算、寄單繳納。",
    amount: (
      <>
        家庭看護工作一般為每人每月 2,000 元，未滿一個月按日計算（
        <Src href="https://fw.wda.gov.tw/wda-employer/home/extra-come-to-tw/index/subCategory/2c95efb39839190201983a74112f053f?locale=zh">外國人勞動權益網</Src>
        ）。雇主或被看護者符合低收入戶、中低收入戶等資格的，可以免繳（
        <Src href="https://www.wda.gov.tw/News_Content.aspx?n=31&s=3860">勞動力發展署</Src>
        ）。
      </>
    ),
    note: "這筆錢是雇主的費用，不能轉嫁給看護、也不能從薪水扣。繳費單是每季寄一次，記得放進家裡的年度預算。",
  },
  {
    n: 3,
    name: "全民健保（每月）",
    what: "看護取得居留證後，要以雇主為投保單位加入全民健保。",
    amount: (
      <>
        保費由雇主和看護各負擔一部分，金額依健保署公告的保費表計算；雇主負擔的部分不能從薪水扣（
        <Src href="https://fw.wda.gov.tw/wda-employer/home/download-file/2c95efb395915190019593b3e2db201b.pdf">雇主申報移工健保 Q&amp;A</Src>
        ）。
      </>
    ),
    note: "仲介通常會協助加保。看護自己要付的那一份如果從薪水代扣，要在薪資明細上寫清楚。",
  },
  {
    n: 4,
    name: "職災保險與意外保險",
    what: "家庭看護工不是勞保的強制對象，但職業災害保險和意外保險都要處理。",
    amount: (
      <>
        勞動部的宣導資料提醒，家事移工的職災保險費由雇主負擔，另外雇主也要依勞動契約為看護投保意外保險（
        <Src href="https://fw.wda.gov.tw/wda-employer/home/file/2c95efb38a0517c3018a07d7f45907f9">意外事故保險說明</Src>、
        <Src href="https://fw.wda.gov.tw/wda-employer/home/file/2c95efb3973cc16401973f3229bc0c70">職災保險費用說明</Src>
        ）。
      </>
    ),
    note: "保額、保費依你選的保險而定，請仲介把保單內容給你看一次。勞保則可以由雇主自願幫她加保。",
  },
  {
    n: 5,
    name: "仲介費用",
    what: "透過仲介申請、引進、後續管理，仲介會向雇主收費，也會向看護收服務費。",
    amount: (
      <>
        兩邊能收哪些項目、上限多少，《私立就業服務機構收費項目及金額標準》都有規定（
        <Src href="https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=N0090028">全國法規資料庫</Src>
        ）。各家仲介的收費方式不同，請以書面報價為準。
      </>
    ),
    note: "簽約前請仲介把每一項費用、收費時間、包含哪些服務列清楚。看護付給仲介的服務費是她自己的支出，不要算進家用金，也不要由你代收代扣而沒有紀錄。",
  },
  {
    n: 6,
    name: "伙食與住宿",
    what: "看護住在家裡，三餐和住宿怎麼提供，要在契約中約定。",
    amount: "沒有統一的金額，依契約約定。有的家庭和她一起吃，有的另外給固定的伙食費。",
    note: "不管哪一種，伙食費都要和薪水、家用金分開。想估自己家要多少，可以看下面的伙食費文章，用三週紀錄算出實際金額。",
  },
  {
    n: 7,
    name: "家用金（每週或每月）",
    what: "家裡的日常開銷：買菜、長輩的尿布、日用品、清潔用品、小額藥局用品。",
    amount: "這是你家本來就會花的錢，只是改由看護去買。金額取決於你家的人數和飲食習慣，前三週照實記錄最準。",
    note: "家用金是「放在她那裡、替家裡花的錢」，不是給她的錢。最常見的做法是固定週轉金，快用完就補。",
  },
  {
    n: 8,
    name: "健康檢查與其他雜支",
    what: "看護入境後與在台期間，依規定要做健康檢查；另外還有居留證、文件、往返交通等雜支。",
    amount: "健檢費用與項目依醫院和仲介安排而不同，誰負擔哪一筆，請在簽約時問清楚、寫下來。",
    note: "這些一年只有幾次，但很容易忘記。建議和薪資放在同一個地方記錄，年底一看就知道請看護一年實際花了多少。",
  },
];

const CHECKLIST = [
  ["先確認長輩的申請資格", "被看護者要符合申請條件（例如巴氏量表評估）。流程和需要的文件，請仲介或各縣市長照管理中心說明。"],
  ["比較兩三家仲介的書面報價", "請對方把雇主要付的費用、看護要付的服務費、包含的服務列成清單，不要只聽口頭說明。"],
  ["看懂勞動契約", "薪資、給薪日、休假、加班、伙食、住宿怎麼約定，簽之前每一項都看一次；看不懂的地方當場問。"],
  ["準備她的房間", "有窗、有門、能好好休息的空間，床和放私人物品的櫃子。這也是她願意長久做下去的關鍵。"],
  ["列出每月固定支出", "薪資、健保、保險、就業安定費（每季）放在同一張表，算出每月大概要準備多少。"],
  ["決定家用金怎麼給", "週轉金多少、哪一天給、剩多少要補、收據怎麼留，在她來的第一週就說好。"],
  ["家人先講好誰出多少", "兄弟姊妹要分攤的話，在她來之前就說定誰負責給錢、誰負責對帳，帳本大家都看得到。"],
];

const FAQ = [
  {
    q: "請外籍看護，每個月固定要準備多少錢？",
    a: "固定的部分是薪資、健保、保險，加上每季繳一次的就業安定費（換算成每月）。薪資目前新聘一般為每月 20,000 元起，另外再加上伙食、家用金和仲介相關費用。每家情況不同，建議請仲介給書面報價，自己再列一張每月支出表。",
  },
  {
    q: "就業安定費可以從看護的薪水扣嗎？",
    a: "不行。就業安定費是雇主依法要繳的費用，不能轉嫁給看護。符合低收入戶、中低收入戶等資格的家庭可以免繳，詳細條件請問仲介或撥 1955 專線。",
  },
  {
    q: "家用金算不算看護的薪水？",
    a: "不算。家用金是家裡的開銷，由看護代為採買，花不完的錢還是家裡的。薪水依勞動契約給付，兩筆要分開給、分開記，帳對不上也不要從薪水扣。",
  },
  {
    q: "伙食費一定要另外給嗎？",
    a: "看你們契約怎麼約定。有的家庭和看護一起吃飯，有的每月另外給固定伙食費。無論哪一種，都要依契約與勞動部規定，不要把伙食費算成薪水的一部分；不確定請問仲介或 1955。",
  },
  {
    q: "第一次請看護，最容易漏算的是哪一筆？",
    a: "常被漏掉的是每季才寄一次的就業安定費、一年幾次的健檢，以及每天都會發生的家用金。前兩筆放進年度預算，家用金則從第一週就開始記帳，三週後就知道實際金額。",
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
          <p className="mt-3 text-sm text-muted">發布於 {A.published}・約 8 分鐘閱讀</p>

          <P>
            家裡長輩需要全天照顧，開始考慮請外籍看護，第一個問題通常是：<strong>一個月到底要花多少？</strong>網路上的數字很多，但每家仲介、每個家庭算法不同。這篇把費用拆成 8 類，有官方公告金額的就附上來源，沒有統一金額的就說明怎麼估，最後附一張開始前的準備清單。
          </P>
          <P>
            先記住一個原則：<strong>薪資、伙食費、家用金是三種不同的錢</strong>。薪資是她的工作報酬，伙食費是她的三餐，家用金是家裡的開銷。一開始就分開，之後就不會算不清楚。
          </P>

          <H2 id="costs">8 類費用一次看</H2>
          <P>下面的金額以撰寫時查到的官方資料為準，政策可能調整，請以勞動部最新公告和你的契約為準。</P>
          <div className="mt-4 space-y-4">
            {COSTS.map((c) => (
              <div key={c.n} className="card">
                <p className="text-xl font-extrabold">{c.n}. {c.name}</p>
                <p className="mt-3 text-[17px] leading-7"><span className="font-bold">是什麼：</span>{c.what}</p>
                <p className="mt-2 text-[17px] leading-7"><span className="font-bold">金額：</span>{c.amount}</p>
                <p className="mt-2 text-[17px] leading-7"><span className="font-bold">提醒：</span>{c.note}</p>
              </div>
            ))}
          </div>

          <H2 id="fixed-vs-variable">固定的錢好算，會變的錢要記</H2>
          <P>
            把上面 8 類分成兩組，就比較好規劃。<strong>固定的</strong>是薪資、健保、保險和每季的就業安定費，每個月幾乎一樣，放進預算表就好。<strong>會變的</strong>是伙食、家用金和偶爾的健檢、雜支，這幾筆才需要每筆記錄。
          </P>
          <P>
            很多家庭一開始只算了薪資，結果發現每個月實際花的比想像多，問題多半出在家用金：每天幾百元的菜錢、尿布、清潔用品，累積起來不是小數目，又因為是現金、零零碎碎，最容易說不清楚。
          </P>

          <H2 id="household-cash">家用金放在哪裡？</H2>
          <P>
            家用金不是「多出來的費用」，而是你家原本就會花的生活開銷，只是改由看護去買。差別在於：以前是自己花、自己知道；現在是交給另一個人，用另一種語言溝通，所以需要一套<strong>雙方都看得懂的記帳方式</strong>。
          </P>
          <P>
            最常見的做法是固定週轉金：每週給一筆固定金額，剩不到某條線就補；每筆拍收據，每週對一次帳。給多少、怎麼給，可以參考{" "}
            <Link href="/guide/household-cash-for-caregivers" className="font-bold text-accent-ink underline underline-offset-4">第一次請外籍看護：家用金怎麼給、怎麼記帳</Link>
            {" "}和{" "}
            <Link href="/guide/how-employers-give-grocery-money" className="font-bold text-accent-ink underline underline-offset-4">家庭移工買菜怎麼給錢？6 種常見方式比較</Link>。
          </P>

          <H2 id="checklist">開始前的準備清單</H2>
          <div className="mt-4 space-y-3">
            {CHECKLIST.map(([name, desc], i) => (
              <div key={name} className="card">
                <p className="text-lg font-bold">{i + 1}. {name}</p>
                <p className="mt-2 text-[17px] leading-7 text-muted">{desc}</p>
              </div>
            ))}
          </div>
          <P>
            兄弟姊妹要一起出錢的話，怎麼分比較公平，可以看{" "}
            <Link href="/guide/siblings-sharing-parent-care-costs" className="font-bold text-accent-ink underline underline-offset-4">兄弟姊妹分攤爸媽的看護費、家用金：怎麼算才不吵架</Link>。
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
            想估伙食費和家用金一個月要多少？請看{" "}
            <Link href="/guide/caregiver-food-and-household-cash-per-month" className="font-bold text-accent-ink underline underline-offset-4">外籍看護伙食費、家用金一個月多少？三種錢分清楚</Link>。
          </P>

          <div className="card mt-12 p-6 text-center">
            <p className="text-2xl font-extrabold">最會變的那筆錢，從第一天就記清楚</p>
            <p className="mt-3 text-lg text-muted">
              CareCash 家用金：看護用印尼文、越南文等母語拍收據記帳，給錢、補錢雙方確認，餘額自動算好，兄弟姊妹也能一起看。
            </p>
            <div className="mx-auto mt-5 max-w-xs">
              <Link href="/sign-in?mode=signup&ref=guide-costs" className="btn-primary">免費開始使用</Link>
            </div>
            <Link href="/sign-in#demo" className="mt-3 inline-block text-base font-semibold text-accent-ink underline underline-offset-4">先不註冊，試用範例家庭</Link>
          </div>

          <ShareArticle url={`${SITE_URL}/guide/${A.slug}?ref=share`} title={A.title} />

          <RelatedArticles current={A.slug} />

          <p className="mt-10 text-sm text-muted">
            本文為一般性的生活建議，不構成法律意見；文中金額以撰寫時查到的官方公告為準，可能隨政策調整。薪資、規費、保險、伙食與工作內容的約定，請以勞動契約、勞動部規定及您的仲介說明為準，不確定時可撥 1955 專線詢問。
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

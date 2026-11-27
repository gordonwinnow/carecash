import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { SiteFooter, SiteHeader } from "../../landing";

const A = {
  slug: "elderly-parent-living-alone-with-caregiver",
  title: "爸媽和看護獨居、子女不同住：遠距管理家用金的方法",
  description:
    "爸媽和外籍看護住，子女住在外地，家用金怎麼給、錢放在誰手上、收據怎麼看、快用完怎麼知道、兄弟姊妹怎麼一起出？整理遠距管理家用金的 6 個做法、每週流程與常見問題。",
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

type Step = { n: number; name: string; how: string; watch: string };

const STEPS: Step[] = [
  {
    n: 1,
    name: "先決定：錢放在誰手上",
    how: "常見有兩種。一是週轉金直接放在看護那裡，她負責日常採買；二是錢放在爸媽那裡，看護要用時跟爸媽拿。爸媽如果記性還好、願意管錢，第二種讓他們保有參與感；如果爸媽容易忘記、或不方便每次拿錢，第一種比較實際。",
    watch: "不管放在誰那裡，都要說清楚「這筆錢的範圍」：日常買菜、日用品可以直接用，超過某個金額的東西先問過子女。爸媽自己的存款、提款卡，不要交給看護保管。",
  },
  {
    n: 2,
    name: "遠端給錢：固定日期、固定方式",
    how: "子女不住在一起，最常見的是固定每週或每兩週回家一次補錢；住得遠的家庭，則請住最近的兄弟姊妹或信任的親戚代為交付，自己再把錢轉給他。重點是固定：固定哪一天、固定由誰交。",
    watch: "每次交錢都要有雙方確認的紀錄，不要只靠電話裡一句「我放在抽屜了」。現金經過越多手，越需要寫下來是誰、什麼時候、交了多少。",
  },
  {
    n: 3,
    name: "收據用拍照，不用寄",
    how: "請看護每買一次東西，就把收據拍照記下來，寫上買了什麼、多少錢。子女在手機上看照片就好，不必等回家才看一疊紙。傳統市場沒有收據的，寫下品項和金額就可以。",
    watch: "照片要放在大家都看得到、不會被聊天訊息洗掉的地方。全部傳在 LINE 群組裡，一個月後就很難找。",
  },
  {
    n: 4,
    name: "設一條「該補錢」的線",
    how: "子女不在身邊，最怕的是錢已經用完、看護不好意思說，只好自己先墊。事先約好：剩下某個金額就要補，不用等她開口。",
    watch: "用 CareCash 的話，可以設定餘額低於某個金額時，手機推播通知你，你就能在用完前安排補錢。",
  },
  {
    n: 5,
    name: "每週一次視訊，順便看帳",
    how: "固定一天跟爸媽和看護視訊，先問爸媽身體和心情，再花幾分鐘一起看這週的帳。看到不清楚的一筆，當場問，比累積到月底再問容易得多。",
    watch: "視訊是關心，不是檢查。先謝謝看護這週的照顧，再談錢；有問題的時候，用「這筆我看不太懂」開頭，而不是質疑。",
  },
  {
    n: 6,
    name: "兄弟姊妹共用一本帳",
    how: "幾個子女一起出錢時，固定一個人負責交錢給看護，其他人把自己那份轉給他。所有人看同一本帳：給了多少、花了多少、還剩多少，每月底貼一次摘要。",
    watch: "最容易吵架的不是誰出得多，而是「錢花到哪裡去」說不清楚。帳大家都看得到，就少了很多猜測。",
  },
];

const WEEK = [
  ["每天", "看護買東西後拍收據、記一筆。子女不需要每天看，有空時滑一下就好。"],
  ["每週固定一天", "視訊問候爸媽，順便一起看這週的帳；需要補錢就約好交錢的時間和人。"],
  ["每次交錢", "交錢的人和看護都確認金額，留下紀錄，其他兄弟姊妹也看得到。"],
  ["每月底", "看一次本月總共花了多少、跟上個月差多少，貼一則摘要給兄弟姊妹。"],
];

const FAQ = [
  {
    q: "子女都不住在家裡，家用金要放在看護那裡嗎？",
    a: "多數家庭會放一筆固定的週轉金在看護那裡，讓她能隨時買長輩需要的東西，不用先墊錢。金額不必太多，搭配「剩多少就補」的約定，再加上每筆拍收據，遠端也能看得清楚。",
  },
  {
    q: "可以把爸媽的提款卡交給看護去領錢嗎？",
    a: "不建議。爸媽的存款、提款卡和密碼，最好由爸媽本人或子女管理，看護只處理事先交給她的家用金。這樣對爸媽是保障，對看護也是保護，萬一有疑問不會說不清楚。",
  },
  {
    q: "看護說錢用完了，但我人在外地怎麼辦？",
    a: "事先約好一位住得近的家人或親戚可以臨時補錢，並且設定「剩多少就補」的提醒，盡量不要讓她自己先墊。真的墊了，請她拍收據記下來，下次交錢時一起還，並確認金額。",
  },
  {
    q: "爸媽也想自己管錢，怎麼跟看護分工？",
    a: "可以讓爸媽保管週轉金，看護需要時跟爸媽拿，買完把收據和找零交回。記帳仍由看護拍照記錄，子女在遠端看。帳對不上時，先一起看紀錄，不要怪任何一方，也不要從看護的薪水扣錢；有疑問請依契約與勞動部規定，問仲介或撥 1955。",
  },
  {
    q: "可以請看護順便幫住外地的子女買東西或跑腿嗎？",
    a: "家庭看護工的工作內容，是照顧契約上的被看護者及其家庭生活所需。替不同住的子女或親戚採買、跑腿，可能超出工作範圍。不確定的話，依契約與勞動部規定，問仲介或 1955。",
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
            爸媽年紀大了，請了外籍看護住在家裡照顧，子女卻因為工作、成家住在別的縣市，甚至在國外。照顧的事交給看護了，但每週的菜錢、尿布錢、日用品的錢，要怎麼從遠方管？給多了怕說不清楚，給少了怕看護自己先墊；兄弟姊妹各出一份，月底又常常對不上。
          </P>
          <P>
            這篇整理<strong>遠距管理家用金的 6 個做法</strong>，從錢放在誰手上、怎麼遠端給錢、收據怎麼看，到快用完怎麼知道、兄弟姊妹怎麼一起管，最後附一份每週的簡單流程。
          </P>

          <H2 id="why-hard">遠距管家用金，難在哪裡</H2>
          <P>
            住在一起的家庭，錢不夠了說一聲就好，收據放在桌上隨時看得到。子女不同住時，三件事會變難：<strong>錢交不到</strong>（人不在，沒辦法隨時補）、<strong>看不到</strong>（收據在家裡，人在外地）、<strong>說不清</strong>（中間經過爸媽、看護、其他兄弟姊妹，每個人記得的數字不一樣）。
          </P>
          <P>下面的 6 個做法，就是分別解決這三件事。</P>

          <H2 id="steps">遠距管理家用金的 6 個做法</H2>
          <div className="mt-4 space-y-4">
            {STEPS.map((s) => (
              <div key={s.n} className="card">
                <p className="text-xl font-extrabold">{s.n}. {s.name}</p>
                <p className="mt-3 text-[17px] leading-7"><span className="font-bold">怎麼做：</span>{s.how}</p>
                <p className="mt-2 text-[17px] leading-7"><span className="font-bold">要注意：</span>{s.watch}</p>
              </div>
            ))}
          </div>

          <H2 id="weekly">一週的簡單流程</H2>
          <P>把上面的做法排進一週，大概是這樣。每個家庭可以依自己的節奏調整，重點是固定。</P>
          <div className="mt-4 space-y-3">
            {WEEK.map(([when, what]) => (
              <div key={when} className="card">
                <p className="text-lg font-bold">{when}</p>
                <p className="mt-2 text-[17px] leading-7 text-muted">{what}</p>
              </div>
            ))}
          </div>

          <H2 id="parents">別忘了爸媽的感受</H2>
          <P>
            子女在遠方管帳，很容易不小心把爸媽排除在外。有些長輩會覺得「我的家、我的錢，怎麼都是孩子和看護在決定」。可以請爸媽一起看帳、一起決定週轉金多少，或讓他們保管一部分零用錢。對爸媽來說，參與本身就是一種尊重。
          </P>
          <P>
            另外，爸媽自己的存款、退休金和提款卡，最好和家用金完全分開。家用金只處理日常採買，大額的醫療、照顧費用由子女或爸媽本人直接處理。
          </P>

          <H2 id="caregiver">對看護也要公平</H2>
          <P>
            子女不在，看護常常是家裡唯一能處理事情的人。讓她手上一直有一筆足夠的週轉金，不要讓她先墊錢；每一次交錢都留下雙方確認的紀錄，她也能證明自己每一筆都清楚。談錢時的用語，可以參考{" "}
            <Link href="/guide/talking-about-money-with-caregiver" className="font-bold text-accent-ink underline underline-offset-4">跟看護談錢不尷尬：10 句中印對照常用句</Link>。
          </P>
          <P>
            家用金和薪水要分開。帳對不上時，先一起看紀錄找原因，不要從薪水扣；薪資、休假與工作內容，請依勞動契約與勞動部規定，不確定時問仲介或撥 1955 專線。
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
            兄弟姊妹要一起出錢？請看{" "}
            <Link href="/guide/siblings-sharing-parent-care-costs" className="font-bold text-accent-ink underline underline-offset-4">兄弟姊妹分攤爸媽的看護費、家用金：怎麼算才不吵架</Link>。
          </P>

          <div className="card mt-12 p-6 text-center">
            <p className="text-2xl font-extrabold">人不在家，帳也看得到</p>
            <p className="mt-3 text-lg text-muted">
              CareCash 家用金：看護用印尼文、越南文等母語拍收據記帳，給錢、補錢雙方確認，餘額自動算好、快用完會提醒，兄弟姊妹也能一起看。
            </p>
            <div className="mx-auto mt-5 max-w-xs">
              <Link href="/sign-in?mode=signup&ref=guide-remote" className="btn-primary">免費開始使用</Link>
            </div>
          </div>

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

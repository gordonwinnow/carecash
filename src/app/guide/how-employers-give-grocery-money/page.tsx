import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { SiteFooter, SiteHeader } from "../../landing";
import { article } from "../articles";

const A = article("how-employers-give-grocery-money")!;

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

type Method = { n: number; name: string; how: string; who: string; pros: string; risks: string; record: string };

const METHODS: Method[] = [
  {
    n: 1,
    name: "固定週轉金（最常見）",
    how: "每週或每兩週先給一筆固定金額，例如 2,000 或 3,000 元，看護用這筆錢買菜和日用品。再約定一條「該補錢的線」，例如剩不到 500 元就補回原本的金額。",
    who: "大多數家庭，尤其是每天開伙、採買頻繁，或雇主白天上班、無法每次給錢的家庭。",
    pros: "看護不用每次開口要錢，雇主也不用天天處理；金額固定，帳很好對：給的錢＝花掉的錢＋手上剩的錢。",
    risks: "最常見的爭議是「錢怎麼這麼快用完」，多半是因為沒有收據或沒有定期對帳。補錢時間不固定，也可能讓看護不好意思開口，最後自己先墊。",
    record: "每筆拍收據記下，每週對帳一次；補錢時雙方確認金額。週轉金是「預先放在她那裡的錢」，不是給她的錢。",
  },
  {
    n: 2,
    name: "每次給整數、找零歸還",
    how: "出門前估一下要買多少，給一個整數。有家庭是這樣做的：「大概 400 就給 500，大概 700 給 1000，發票明細和零錢放在約定的位置，剩下的零錢收起來下次再用。」",
    who: "雇主或家人每天在家、採買次數不多，或剛開始請看護、還在摸索每週花費的家庭。",
    pros: "每一趟都有頭有尾，錢和收據當天就能對上；看護手上不會放太多現金，雙方都比較安心。",
    risks: "零錢和發票很容易越積越亂，幾天後就對不起來；雇主不在家時，看護沒有錢可以臨時採買。每次都要開口要錢，對看護也是一種壓力。",
    record: "每趟記「給了多少、花了多少、找回多少」。零錢收起來下次用的話，也要記下目前累積多少，不然很快就會不知道有多少錢在外面。",
  },
  {
    n: 3,
    name: "先墊後報（不建議）",
    how: "看護先用自己的錢買，之後拿收據跟雇主報帳拿回來。",
    who: "原則上不建議當作常態。只有臨時、小額、事前說好的情況，例如週轉金剛好用完、雇主隔天就補，才勉強可以。",
    pros: "雇主不用預先放錢，看起來最省事。",
    risks: "看護的薪水多半要寄回家鄉，先墊等於讓她把自己的錢借給雇主。報帳晚了、收據不見、金額有爭議，損失都落在她身上；她也可能因為不敢多墊錢，該買的不買。",
    record: "如果真的要墊，事前說好上限和還款時間（例如當天或隔天），每筆拍收據，還錢時雙方確認。更好的做法是改用方式 1，讓她手上一直有一筆週轉金。",
  },
  {
    n: 4,
    name: "雇主自己買、網購外送",
    how: "大宗物品由雇主自己買，或在網路上訂好送到家，例如米、油、尿布、衛生紙、清潔用品。看護只用一小筆零用的家用金，補買青菜、水果等臨時需要的東西。",
    who: "雇主習慣網購、對品牌或價格比較講究，或家裡長輩需要固定的尿布、營養品的家庭。",
    pros: "看護手上的現金少，對帳很簡單；大宗物品價格和品項由雇主決定，比較不會買錯。",
    risks: "缺貨時常常要等，或看護不知道該不該自己先買；網購的錢和家用金分兩邊記，月底算總花費時容易漏掉。",
    record: "看護那筆小額家用金照方式 1 記帳；雇主網購的也記在同一本帳，才知道家裡一個月實際花多少。",
  },
  {
    n: 5,
    name: "每月固定伙食費，讓看護自己安排",
    how: "看護自己的三餐，每個月固定給一筆伙食費，由她自己買、自己煮；家裡的菜錢和日用品另外用家用金處理。",
    who: "看護和家人飲食習慣差很多（例如穆斯林不吃豬肉），或家人不常在家吃飯的家庭。",
    pros: "看護可以吃自己習慣的食物，雇主也不用管她每一餐吃什麼。",
    risks: "伙食費和家用金混在一起，是最容易對不起來的情況。伙食怎麼提供、要不要另外給錢，要依勞動契約與相關規定約定；不要自行從薪水扣，也不要把伙食費當成薪水的一部分。",
    record: "伙食費當作獨立的一筆，固定日期給、雙方確認，不需要她交收據；家用金照常每筆記帳。兩筆分開記，就不會混。",
  },
  {
    n: 6,
    name: "店家記帳或儲值卡",
    how: "在熟悉的巷口雜貨店、菜攤先說好，看護去拿東西先記帳，雇主每週或每月去結；或是給一張電子票證、超商的儲值卡，讓她在可以刷卡的地方使用。",
    who: "住在老社區、和附近店家很熟的家庭，或想少讓看護帶現金的家庭。",
    pros: "看護不用帶太多現金；店家記帳的話，雇主結帳時就能看到明細。",
    risks: "傳統市場、菜攤多半只收現金，儲值卡能用的地方有限；卡片有儲值上限，遺失時也可能有損失。店家記帳靠的是彼此的信任，結帳時對不上就很尷尬。",
    record: "結帳或儲值時記一筆，儲值卡的消費明細定期看一次；如果同時還有一筆現金家用金，兩邊都要記在同一本帳。",
  },
];

const CHOOSE = [
  ["長輩一人＋看護", "家裡白天常常只有長輩和看護，建議用「固定週轉金」，再搭配雇主網購大宗物品。看護要能隨時買到長輩需要的東西，不要讓她先墊。"],
  ["和子女同住", "家人每天都在，可以用「每次給整數、找零歸還」，或週轉金都行。記得零錢和收據放在固定的位置，每週對一次帳。"],
  ["兄弟姊妹分攤", "固定一個人交家用金給看護，其他人把自己那份轉給他；所有支出記在同一本帳，大家都看得到，每月貼一次摘要。"],
  ["雇主不同住", "最適合「固定週轉金」：用轉帳或固定時間回家補錢，收據拍照記帳，遠端也看得到餘額。大宗物品可以網購直接送到家。"],
];

const RULES = [
  ["金額固定", "每週給多少、剩多少要補，事先說好，不用每次討價還價。"],
  ["交接雙方確認", "每次給錢、補錢、找零，雙方都確認金額，留下紀錄。"],
  ["收據留存", "每筆支出拍收據，沒有收據的小攤販，就寫下買了什麼、多少錢。"],
  ["每週對帳", "固定一天對帳：給的錢＝花掉的錢＋手上剩的錢。"],
  ["不從薪水扣", "薪水歸薪水，家用金另外處理；帳對不上，先坐下來一起看，不要扣錢。"],
];

const FAQ = [
  {
    q: "哪一種方式最多家庭用？",
    a: "多數家庭用的是「固定週轉金」：先放一筆固定金額在看護那裡，快用完就補。它不需要看護每次開口要錢，也最容易對帳。其他方式可以搭配使用，例如週轉金加上網購大宗物品。",
  },
  {
    q: "可以讓看護先墊錢再報帳嗎？",
    a: "不建議當作常態。看護的薪水多半要寄回家，先墊等於讓她借錢給雇主，收據不見或報帳太晚，損失都在她身上。真的需要時，事先說好上限和還錢時間，最好當天或隔天就還。",
  },
  {
    q: "家用金對不起來，可以從薪水扣嗎？",
    a: "不要自行從薪水扣錢。薪水依勞動契約與勞動部規定給付，家用金另外記帳。帳對不上時，先一起看收據和紀錄找原因；有疑問請問仲介或撥 1955 專線。",
  },
  {
    q: "可以請看護順便幫其他親戚買東西嗎？",
    a: "家庭看護工的工作內容，是照顧契約上的被看護者及其家庭生活所需。請她幫不同住的親戚跑腿、採買，可能超出工作範圍。不確定的話，依契約與勞動部規定，問仲介或 1955。",
  },
  {
    q: "看護的伙食費要跟家用金一起給嗎？",
    a: "建議分開。家用金是家裡的開銷，要每筆記帳；伙食費是看護自己的三餐，固定金額、固定日期給就好。混在一起，月底一定對不起來。伙食怎麼提供，請依契約約定。",
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
            家裡請了家庭看護，每天買菜、買長輩的尿布和日用品，錢要怎麼給？有人每週給一筆，有人每次出門前才給，也有人乾脆自己網購。沒有哪一種一定對，但每一種都有適合的家庭和常見的爭議。下面整理<strong>6 種常見方式</strong>，每一種都說明怎麼做、適合誰、優點、風險和怎麼記帳。
          </P>
          <P>
            先提醒一件事：這裡講的是<strong>家用金</strong>，也就是家裡的開銷。看護的薪水和她自己的伙食費，最好分開給、分開記。
          </P>

          <H2 id="methods">6 種常見方式</H2>
          <div className="mt-4 space-y-4">
            {METHODS.map((m) => (
              <div key={m.n} className="card">
                <p className="text-xl font-extrabold">{m.n}. {m.name}</p>
                <p className="mt-3 text-[17px] leading-7"><span className="font-bold">怎麼做：</span>{m.how}</p>
                <p className="mt-2 text-[17px] leading-7"><span className="font-bold">適合誰：</span>{m.who}</p>
                <p className="mt-2 text-[17px] leading-7"><span className="font-bold">優點：</span>{m.pros}</p>
                <p className="mt-2 text-[17px] leading-7"><span className="font-bold">風險／常見爭議：</span>{m.risks}</p>
                <p className="mt-2 text-[17px] leading-7"><span className="font-bold">怎麼記帳：</span>{m.record}</p>
              </div>
            ))}
          </div>

          <H2 id="choose">怎麼選？看你家的狀況</H2>
          <P>很多家庭會混著用，例如「週轉金＋網購大宗物品」。可以先從自己家的情況開始想：</P>
          <div className="mt-4 space-y-3">
            {CHOOSE.map(([who, tip]) => (
              <div key={who} className="card">
                <p className="text-lg font-bold">{who}</p>
                <p className="mt-2 text-[17px] leading-7 text-muted">{tip}</p>
              </div>
            ))}
          </div>

          <H2 id="rules">不管用哪一種，五個原則</H2>
          <div className="mt-4 space-y-3">
            {RULES.map(([name, desc]) => (
              <div key={name} className="card">
                <p className="text-lg font-bold">{name}</p>
                <p className="mt-2 text-[17px] leading-7 text-muted">{desc}</p>
              </div>
            ))}
          </div>
          <P>這五件事做到，不管用哪一種方式，大部分的誤會都不會發生。</P>

          <H2 id="scope">提醒：採買要在工作範圍內</H2>
          <P>
            家庭看護工的採買，應該是為了<strong>被看護者和這個家的生活所需</strong>，依契約約定的工作內容。請她幫不同住的兄弟姊妹、親戚跑腿買東西，可能超出工作範圍，也會讓帳變得很亂。工作內容怎麼約定，請依契約與勞動部規定；不確定的話，問仲介或撥 1955 專線。
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
            不知道一週要給多少？請看{" "}
            <Link href="/guide/caregiver-food-and-household-cash-per-month" className="font-bold text-accent-ink underline underline-offset-4">外籍看護伙食費、家用金一個月多少？三種錢分清楚</Link>。
          </P>

          <div className="card mt-12 p-6 text-center">
            <p className="text-2xl font-extrabold">哪一種方式，帳都能記清楚</p>
            <p className="mt-3 text-lg text-muted">
              CareCash 家用金：看護用印尼文、越南文等母語拍收據記帳，給錢、補錢雙方確認，餘額自動算好，兄弟姊妹也能一起看。
            </p>
            <div className="mx-auto mt-5 max-w-xs">
              <Link href="/sign-in?mode=signup&ref=guide-methods" className="btn-primary">免費開始使用</Link>
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

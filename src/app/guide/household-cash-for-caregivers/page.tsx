import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { SiteFooter, SiteHeader } from "../../landing";
import { article } from "../articles";
import { RelatedArticles } from "../related";

const A = article("household-cash-for-caregivers")!;

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

const TOC = [
  ["what", "家用金是什麼？包含哪些開銷"],
  ["how-much", "一週要給多少？"],
  ["handover", "交錢的方法：雙方確認"],
  ["receipts", "收據與發票怎麼留"],
  ["reconcile", "每週五分鐘對帳"],
  ["fronted", "看護自己墊錢怎麼辦"],
  ["donts", "幾件不要做的事"],
  ["faq", "常見問題"],
];

const FAQ = [
  {
    q: "家用金要每天給還是每週給？",
    a: "多數家庭每週固定給一次比較好管理：金額固定、時間固定，看護也好規劃。剛開始可以先每週給，觀察兩三週的實際花費再調整。",
  },
  {
    q: "看護的伙食費算在家用金裡嗎？",
    a: "看各家和契約的約定。有的家庭是看護跟家人一起吃、伙食從家用金支出；有的是另外給看護伙食費。重點是一開始就講清楚、寫下來，雙方都知道哪些錢用在哪裡。",
  },
  {
    q: "看護不會寫中文，怎麼記帳？",
    a: "不一定要寫字。請她把收據拍照、寫上金額就好；或用支援她母語的記帳工具，她用印尼文或越南文操作，你看到的是中文。",
  },
  {
    q: "兄弟姊妹一起分攤費用，帳要怎麼記？",
    a: "最怕「我上次明明有給」。建議用同一本帳（同一個表格或同一個 App），誰給了多少錢都記在裡面，大家看到同一個餘額。",
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
            第一次請外籍看護，大家最先準備的是房間、契約和照顧細節。但開始生活之後，最常讓雇主和看護之間卡卡的，往往是一件小事：<strong>家用金</strong>。給了多少、花去哪裡、還剩多少，三個問題只要有一個對不起來，信任就會慢慢流失。
          </P>
          <P>這篇整理一套簡單、對雙方都公平的方法，第一週就可以開始用。</P>

          <div className="card mt-8">
            <p className="font-bold">本文重點</p>
            <ol className="mt-2 list-decimal space-y-1 pl-6 text-[17px]">
              {TOC.map(([id, t]) => (
                <li key={id}><a href={`#${id}`} className="underline-offset-4 hover:underline">{t}</a></li>
              ))}
            </ol>
          </div>

          <H2 id="what">家用金是什麼？包含哪些開銷</H2>
          <P>
            家用金是雇主預先交給看護、用來支付日常照顧與家用開銷的現金，常見的有：買菜和食材、長輩的日用品（尿布、濕紙巾）、藥局的小額用品、清潔用品。
          </P>
          <P>
            建議在第一週就和看護一起列出「哪些可以用家用金買」，大額或特殊的東西（例如營養品、醫療器材）先問過再買。清單寫下來、貼在冰箱上，比口頭說明清楚得多。
          </P>

          <H2 id="how-much">一週要給多少？</H2>
          <P>
            沒有標準答案，取決於你家的人數、飲食習慣和住的地方。網路上業者的估計，伙食與買菜大約一天新台幣 200 到 300 元、一個月約 6,000 元上下（
            <Src href="https://kaiyi-vip.com/caregiver-room-board-rules/">楷懿人力</Src>、
            <Src href="https://www.businesstoday.com.tw/article/category/183029/post/202110120028/">今周刊</Src>
            ），可以當作起點參考。
          </P>
          <P>比較實用的做法是「固定週轉金」：</P>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-lg leading-8">
            <li>每週固定一天給固定金額，例如每週一給 2,000 元。</li>
            <li>設一條「該補錢」的線，例如剩不到 500 元就先補，不要等到用完。</li>
            <li>前三週照實記錄，第四週再依實際花費調整金額。</li>
          </ol>
          <P>這樣看護不會因為錢不夠而自己先墊，你也不用每天被問「錢用完了」。</P>

          <H2 id="handover">交錢的方法：雙方確認</H2>
          <P>
            很多爭議都來自交錢的那一刻：錢放在桌上、請家人轉交、口頭說一聲。幾週後，雙方記得的數字就不一樣了。
          </P>
          <P>
            簡單的原則是：<strong>每次給錢，都讓對方確認收到</strong>。可以是一本雙方簽名的小簿子，也可以是手機上按一下「已收到」。這不是不信任，而是讓兩邊都安心：你知道錢確實交到了，她也不會被冤枉少拿或多拿。
          </P>

          <H2 id="receipts">收據與發票怎麼留</H2>
          <P>
            紙本收據容易弄丟、褪色，也很難對帳。建議請看護<strong>每次買完就拍照</strong>，照片上看得到金額和日期就好。
          </P>
          <P>
            另一個小技巧：把家裡的<strong>手機條碼載具</strong>給看護，結帳時出示條碼，發票就會自動存到你的載具裡。你在財政部的「統一發票兌獎」App 上就看得到每一筆消費，也不會漏掉中獎的發票。
          </P>

          <H2 id="reconcile">每週五分鐘對帳</H2>
          <P>對帳不需要複雜，只要一個公式：</P>
          <div className="card mt-4 text-center text-lg font-bold">上週剩下的錢 ＋ 這週給的錢 － 這週花的錢 ＝ 現在應該有的錢</div>
          <P>
            每週固定一個時間，跟看護一起看一下這個數字和她手上的現金是否差不多。差一點點很正常（零錢、忘了拍的收據），差很多再一起回想。<strong>重點是固定、輕鬆，不要變成審問。</strong>
          </P>

          <H2 id="fronted">看護自己墊錢怎麼辦</H2>
          <P>
            家用金不夠的時候，很多看護會先用自己的薪水墊。這筆錢對她來說可能很重要，卻最容易被忘記。請她把墊付的錢也記下來（拍收據、寫「我先付」），<strong>當週就還給她</strong>。如果常常需要墊錢，代表週轉金給得太少，該調高了。
          </P>

          <H2 id="donts">幾件不要做的事</H2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-lg leading-8">
            <li><strong>不要從薪水裡扣家用金的差額。</strong>家用金和薪水分開處理；對帳有落差，先溝通了解原因。</li>
            <li><strong>不要讓看護保管或代管她不同意的財物，也不要扣留她的證件。</strong>就業服務法明文禁止（<Src href="https://laws.mol.gov.tw/FLAW/FLAWDOC01.aspx?id=FL015128&flno=57">就服法第 57 條</Src>）。</li>
            <li><strong>不要請看護做契約範圍以外的差事。</strong>例如幫其他家人跑腿、到店裡幫忙，可能違反規定並被處罰。家用金用在被照顧者與家中的日常照顧開銷就好。</li>
            <li><strong>不要只用口頭交代。</strong>寫下來、拍下來，對雙方都是保障。</li>
          </ul>

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
            <p className="text-2xl font-extrabold">想省掉紙本和對帳的麻煩？</p>
            <p className="mt-3 text-lg text-muted">
              CareCash 家用金 把上面的方法做成免費工具：給錢雙方確認、收據拍照留存、餘額自動算好，看護可以用印尼文、越南文等母語操作。
            </p>
            <div className="mx-auto mt-5 max-w-xs">
              <Link href="/sign-in?mode=signup&ref=guide" className="btn-primary">免費開始使用</Link>
            </div>
            <Link href="/sign-in#demo" className="mt-3 inline-block text-base font-semibold text-accent-ink underline underline-offset-4">先不註冊，試用範例家庭</Link>
          </div>

          <RelatedArticles current={A.slug} />

          <p className="mt-10 text-sm text-muted">
            本文為一般性的生活建議，不構成法律意見；契約與法規細節請以勞動部公告及您的仲介說明為準。
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

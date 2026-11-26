import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { SiteFooter, SiteHeader } from "../../landing";
import { article } from "../articles";

const A = article("caregiver-food-and-household-cash-per-month")!;

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

const FAQ = [
  {
    q: "伙食費要給現金，還是讓看護跟我們一起吃？",
    a: "兩種都很常見。一起吃的家庭，食材從家用金支出；另外給伙食費的家庭，就固定金額給看護自己安排。重點是開始前講清楚、寫下來，並符合契約的約定。",
  },
  {
    q: "伙食費可以從薪水裡扣嗎？",
    a: "要依勞動契約與相關規定辦理，不要自行從薪水扣錢。最簡單的做法是：薪水歸薪水，伙食與家用金另外處理、另外記帳。不確定時請問仲介或 1955 專線。",
  },
  {
    q: "看護是穆斯林，飲食要注意什麼？",
    a: "許多印尼籍看護是穆斯林，不吃豬肉。如果一起吃飯，記得讓她能買自己可以吃的食材；另外給伙食費的話，金額要讓她買得到合適的食物。",
  },
  {
    q: "家用金每個月都不一樣，怎麼辦？",
    a: "正常。過年、長輩生病、換季都會變動。用「固定週轉金＋該補錢的線」的方式，就不用每次重新算，快用完就補。",
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
          <p className="mt-3 text-sm text-muted">發布於 {A.published}・約 5 分鐘閱讀</p>

          <P>
            「請看護，一個月伙食和家用要準備多少錢？」這是第一次請外籍看護的家庭最常問的問題之一。答案因家而異，但只要先把<strong>三種錢分清楚</strong>，再用三週記錄，就能算出你家實際需要的金額。
          </P>

          <H2 id="three">先分清楚三種錢</H2>
          <div className="mt-4 space-y-3">
            {[
              ["薪水", "看護的工資", "依契約按時給付，薪資單另外保存"],
              ["伙食費", "看護自己的三餐", "一起吃，或另外固定給，依契約約定"],
              ["家用金", "買菜、長輩日用品、清潔用品等家裡開銷", "預先給一筆週轉金，看護憑收據支出"],
            ].map(([name, use, how]) => (
              <div key={name} className="card">
                <p className="text-xl font-extrabold">{name}</p>
                <p className="mt-1 text-[17px]"><span className="text-muted">用在：</span>{use}</p>
                <p className="mt-1 text-[17px]"><span className="text-muted">怎麼處理：</span>{how}</p>
              </div>
            ))}
          </div>
          <P>三種錢混在一起，是對帳對不起來、互相誤會最常見的原因。<strong>分開給、分開記</strong>，就解決一大半。</P>

          <H2 id="range">一般行情參考</H2>
          <P>
            網路上業者的估計，看護伙食與買菜大約<strong>一天新台幣 200 到 300 元、一個月約 6,000 元上下</strong>（
            <Src href="https://kaiyi-vip.com/caregiver-room-board-rules/">楷懿人力</Src>、
            <Src href="https://www.businesstoday.com.tw/article/category/183029/post/202110120028/">今周刊</Src>
            ）。這只是起點：如果家用金還包含全家的菜錢、長輩的尿布和營養品，金額會高很多。
          </P>
          <P>會影響金額的幾件事：</P>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-lg leading-8">
            <li>家裡幾個人一起吃、是否每天開伙</li>
            <li>住在市區還是郊區（離市場、超市的距離與物價）</li>
            <li>長輩的需求：尿布、濕紙巾、營養品、特殊飲食</li>
            <li>看護的飲食習慣，例如穆斯林不吃豬肉</li>
          </ul>

          <H2 id="estimate">三週算出你家的金額</H2>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-lg leading-8">
            <li>先給一筆週轉金，例如 3,000 元。</li>
            <li>請看護每筆支出拍收據，連續記三週。</li>
            <li>三週總支出 ÷ 3 ＝ 你家一週的實際花費，就用這個數字當每週家用金。</li>
            <li>設一條「該補錢」的線（例如剩不到 500 元），不要讓看護自己先墊錢。</li>
          </ol>
          <div className="card mt-6">
            <p className="font-bold">範例（僅供說明）</p>
            <p className="mt-2 text-[17px] leading-7 text-muted">
              三週收據加起來 6,300 元 → 每週約 2,100 元 → 每週一給 2,100 元，剩不到 500 元就先補。若看護三餐另外給伙食費，就另外記一筆，不跟家用金混在一起。
            </p>
          </div>

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
            想知道家用金怎麼交接、怎麼對帳？請看{" "}
            <Link href="/guide/household-cash-for-caregivers" className="font-bold text-accent-ink underline underline-offset-4">第一次請外籍看護：家用金怎麼給、怎麼記帳</Link>。
          </P>

          <div className="card mt-12 p-6 text-center">
            <p className="text-2xl font-extrabold">三週記錄，交給手機就好</p>
            <p className="mt-3 text-lg text-muted">
              CareCash 家用金：看護拍收據記帳、給錢雙方確認，每週花多少自動算好。看護可以用印尼文、越南文等母語操作。
            </p>
            <div className="mx-auto mt-5 max-w-xs">
              <Link href="/sign-in?mode=signup&ref=guide-food" className="btn-primary">免費開始使用</Link>
            </div>
          </div>

          <p className="mt-10 text-sm text-muted">
            本文為一般性的生活建議，不構成法律意見；薪資、伙食與住宿的約定，請以勞動契約、勞動部公告及您的仲介說明為準。
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

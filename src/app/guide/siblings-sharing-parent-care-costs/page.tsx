import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { SiteFooter, SiteHeader } from "../../landing";
import { article } from "../articles";
import { RelatedArticles } from "../related";
import { ShareArticle } from "../share";

const A = article("siblings-sharing-parent-care-costs")!;

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

const FAQ = [
  {
    q: "有一個兄弟姊妹真的拿不出錢，怎麼辦？",
    a: "可以先改用依收入比例分，或讓他多「出力」，例如負責陪診、週末輪班，大家同意後折算成一部分費用。重點是講好、寫下來，不要默默讓別人吃虧，久了最容易吵。",
  },
  {
    q: "爸媽自己有退休金或存款，要先用嗎？",
    a: "很多家庭會先用爸媽自己的錢，不夠的部分再由子女分攤。怎麼用、誰管帳，最好全家一起決定，並把爸媽的錢和子女分攤的錢分開記，日後才說得清楚。",
  },
  {
    q: "家用金應該由誰拿給看護？",
    a: "建議固定由一位住得近、方便的兄弟姊妹交給看護，其他人把自己那份轉給他。交錢時雙方確認並留紀錄，看護只需要面對一個人，也不會搞不清楚錢是誰給的。",
  },
  {
    q: "就業安定費、健保這些費用要不要一起分？",
    a: "要。請外籍看護除了薪水，還有依勞動部規定繳納的就業安定費、健保、仲介服務費等。金額請以仲介和繳費單為準，把它們列進每月的總費用一起分，才不會漏掉。",
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
            爸媽需要人照顧，請了外籍看護，接下來兄弟姊妹最常卡住的不是照顧本身，而是<strong>錢怎麼分</strong>。有人覺得自己出得多，有人覺得自己跑得多，誰都沒說出口，心裡卻越來越不舒服。其實只要做到三件事：<strong>把費用列清楚、選一種大家同意的分法、用同一本帳</strong>，大部分的爭執都可以避免。
          </P>

          <H2 id="buckets">先把每個月的錢列出來</H2>
          <P>先別急著討論誰出多少，先一起把「每個月到底要花哪些錢」列清楚：</P>
          <div className="mt-4 space-y-3">
            {[
              ["看護薪水", "依勞動契約按月給付", "每月固定"],
              ["政府規費與保險", "就業安定費（依勞動部規定）、健保等", "依繳費單，金額請以仲介說明為準"],
              ["仲介服務費", "若有委託仲介，依與仲介簽的契約", "依契約約定"],
              ["看護伙食", "一起吃或另外給伙食費，依契約約定", "每月大致固定"],
              ["家用金", "買菜、尿布、日用品、清潔用品等", "每週或每月補，會變動"],
              ["醫療與其他", "掛號、藥費、輔具、交通、營養品", "不固定，偶爾有大筆支出"],
            ].map(([name, use, how]) => (
              <div key={name} className="card">
                <p className="text-xl font-extrabold">{name}</p>
                <p className="mt-1 text-[17px]"><span className="text-muted">包含：</span>{use}</p>
                <p className="mt-1 text-[17px]"><span className="text-muted">頻率：</span>{how}</p>
              </div>
            ))}
          </div>
          <P>列出來之後，大家會發現：固定的錢好談，<strong>真正容易吵的是「會變動」的家用金和醫療費</strong>。所以這兩項更需要收據和紀錄。</P>

          <H2 id="models">三種常見的分法</H2>
          <P>沒有哪一種分法一定對，重點是<strong>全家都同意</strong>。下面用同一個例子比較三種方式。</P>
          <div className="card mt-6">
            <p className="font-bold">範例（數字僅供說明，請換成你家的實際金額）</p>
            <p className="mt-2 text-[17px] leading-7 text-muted">
              假設爸爸每個月照顧相關的總費用是 45,000 元，三兄妹：老大、老二、老三。老三住得最近，平常負責陪診、採買和跟看護溝通。
            </p>
          </div>
          <div className="mt-4 space-y-3">
            <div className="card">
              <p className="text-xl font-extrabold">1. 平均分</p>
              <p className="mt-1 text-[17px] leading-7">每人 45,000 ÷ 3 ＝ <strong>15,000 元</strong>。</p>
              <p className="mt-1 text-[17px] leading-7 text-muted">最簡單、最好算。適合收入差不多、出力也差不多的家庭。</p>
            </div>
            <div className="card">
              <p className="text-xl font-extrabold">2. 依收入比例分</p>
              <p className="mt-1 text-[17px] leading-7">大家同意以 5：3：2 分攤：老大 <strong>22,500</strong>、老二 <strong>13,500</strong>、老三 <strong>9,000</strong> 元。</p>
              <p className="mt-1 text-[17px] leading-7 text-muted">適合收入差距大的家庭。比例要大家都覺得合理，不必公開薪資細節，談一個大家接受的數字即可。</p>
            </div>
            <div className="card">
              <p className="text-xl font-extrabold">3. 出錢出力折算</p>
              <p className="mt-1 text-[17px] leading-7">
                大家同意老三的陪診與跑腿每月折算 6,000 元。把它加進總額：(45,000 ＋ 6,000) ÷ 3 ＝ 17,000 元。老大、老二各付 <strong>17,000</strong>，老三付 17,000 − 6,000 ＝ <strong>11,000</strong> 元，合計正好 45,000 元。
              </p>
              <p className="mt-1 text-[17px] leading-7 text-muted">適合有人住得近、負擔較多照顧工作的家庭。折算多少要事先講好，而不是事後各自認定。</p>
            </div>
          </div>
          <P>不管選哪一種，都建議把結果寫成一段簡單的文字傳到家族群組，並約好<strong>半年或一年檢討一次</strong>。爸媽的狀況會變，大家的收入也會變。</P>

          <H2 id="ledger">一本帳，大家都看得到</H2>
          <P>
            兄弟姊妹之間最傷感情的一句話是「錢都花到哪裡去了？」解決方法很簡單：<strong>所有支出都記在同一本帳，每個人隨時都看得到</strong>。看護買菜、買尿布，每筆拍收據；醫療費、繳費單也一起記進去。
          </P>
          <P>不要各自記在自己的筆記本或 Excel，最後對不起來，反而更容易誤會。誰轉了多少錢、看護花了多少、還剩多少，都在同一個地方。</P>

          <H2 id="holder">誰拿現金、誰交給看護</H2>
          <P>看護需要現金買菜和日用品，但如果三個人輪流給、各給各的，看護會搞不清楚，帳也會亂。建議：</P>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-lg leading-8">
            <li>固定由<strong>一位</strong>兄弟姊妹負責把家用金交給看護，通常是住得最近的人。</li>
            <li>其他人把自己的那份定期轉給他，轉帳也記進帳裡。</li>
            <li>每次交現金，雙方都確認金額並留下紀錄，不要只是口頭說「給你了」。</li>
            <li>設一條該補錢的線，快用完就補，不要讓看護自己先墊錢。</li>
          </ul>

          <H2 id="settle">每月 5 分鐘對帳</H2>
          <P>每個月固定一天（例如月初），由管帳的人在家族群組貼出一段簡單的摘要：</P>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-lg leading-8">
            <li>這個月總共花了多少，固定費用和變動費用各多少。</li>
            <li>每個人應付多少、實際已付多少。</li>
            <li>誰多付了、誰還差多少，下個月一起補齊。</li>
            <li>有沒有特別的大筆支出（例如住院、買輪椅），需要大家另外討論。</li>
          </ol>
          <P>帳本本來就清楚的話，這件事真的只要 5 分鐘。固定時間做，就不會累積成一筆說不清的舊帳。</P>

          <H2 id="talk">怎麼談，才不會吵起來</H2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-lg leading-8">
            <li><strong>先談事實，再談分法。</strong>先一起看清楚每月要花多少，再討論誰出多少。</li>
            <li><strong>肯定出力的人。</strong>住得近、常陪診的人很辛苦，把他的付出說出來，比什麼都重要。</li>
            <li><strong>大筆支出先講好門檻。</strong>例如超過某個金額要先在群組說一聲，其他人比較安心。</li>
            <li><strong>就事論事，不翻舊帳。</strong>過去誰照顧多、誰照顧少，很難算清楚，往前看比較實際。</li>
            <li><strong>真的談不攏，就請中立的人幫忙。</strong>例如長輩信任的親戚，或長照個管人員。</li>
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

          <P>
            想知道家用金一個月大概要準備多少？請看{" "}
            <Link href="/guide/caregiver-food-and-household-cash-per-month" className="font-bold text-accent-ink underline underline-offset-4">外籍看護伙食費、家用金一個月多少？三種錢分清楚</Link>。
          </P>

          <div className="card mt-12 p-6 text-center">
            <p className="text-2xl font-extrabold">兄弟姊妹共用一本帳</p>
            <p className="mt-3 text-lg text-muted">
              CareCash 家用金：兄弟姊妹可以共用一個帳本一起出錢，看護拍收據記帳、給錢雙方確認，餘額自動算好。看護可以用印尼文、越南文、菲律賓文、泰文等母語操作。
            </p>
            <div className="mx-auto mt-5 max-w-xs">
              <Link href="/sign-in?mode=signup&ref=guide-siblings" className="btn-primary">免費開始使用</Link>
            </div>
            <Link href="/sign-in#demo" className="mt-3 inline-block text-base font-semibold text-accent-ink underline underline-offset-4">先不註冊，試用範例家庭</Link>
          </div>

          <ShareArticle url={`${SITE_URL}/guide/${A.slug}?ref=share`} title={A.title} />

          <RelatedArticles current={A.slug} />

          <p className="mt-10 text-sm text-muted">
            本文為一般性的生活建議，不構成法律或財務意見；薪資、就業安定費、健保等費用，請以勞動契約、勞動部公告及您的仲介說明為準。
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

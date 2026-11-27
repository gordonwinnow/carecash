import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { SiteFooter, SiteHeader } from "../../landing";
import { article } from "../articles";
import { RelatedArticles } from "../related";
import { ShareArticle } from "../share";

const A = article("caregiver-food-and-halal")!;

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

const BASICS = [
  ["不吃豬肉", "包括豬肉做的加工品，例如香腸、火腿、肉鬆、貢丸，以及用豬油、豬骨熬的湯。很多台灣家常菜都會用到，買之前看一下成分。"],
  ["不喝酒", "多數穆斯林不喝酒。料理用的米酒、紹興酒、味醂，有些人也會避開，每個人在意的程度不同，直接問她最準。"],
  ["其他肉類", "雞、牛、羊、魚通常可以吃，但比較嚴格的人會希望是依清真方式處理的肉。吃不吃、在不在意，同樣問她。"],
  ["看清真標章", "超市有些商品有清真（Halal）認證標章。泡麵、餅乾、調味料、零食裡常有豬油或動物性成分，不確定時，她通常比你更會看。"],
];

const COOKING = [
  {
    t: "方式一：一起吃，菜色不用豬肉",
    how: "家裡的菜改用雞、魚、蛋、豆腐、青菜，大家吃同一桌。",
    fit: "長輩飲食清淡、家人不常在家吃飯的家庭。",
    note: "最省事，也最有一家人的感覺。長輩如果想吃豬肉，偶爾另外買外食就好。",
  },
  {
    t: "方式二：家裡照常煮，她另外煮自己的",
    how: "長輩和家人的菜照原本的習慣煮，她用自己的鍋子、砧板、碗筷，另外煮自己的三餐。",
    fit: "長輩習慣吃豬肉，或家人口味和她差很多的家庭。",
    note: "幫她準備一套自己的鍋具和餐具，花不了多少錢，她會很感謝。這種方式最常搭配「固定伙食費」。",
  },
  {
    t: "方式三：她煮給長輩吃，但不碰豬肉",
    how: "需要豬肉的菜由家人煮或買現成的，她負責其他料理。",
    fit: "長輩一定要吃某些豬肉料理，而她不方便處理的家庭。",
    note: "要不要處理豬肉，每個人接受的程度不同。有人可以戴手套處理，有人不願意。請在一開始就問清楚，不要勉強她。",
  },
];

const MONEY = [
  ["伙食費：她自己的三餐", "固定金額、固定日期給，雙方確認就好，不需要她交收據，也不用管她每一餐吃什麼。"],
  ["家用金：家裡的開銷", "長輩的菜、日用品、尿布，每筆拍收據記帳，每週對帳一次。"],
  ["兩筆分開放、分開記", "她自己的菜和長輩的菜，常常在同一趟買。收據上可以標一下哪些是家裡的，或乾脆分兩次結帳，月底就不會混。"],
];

const FAQ = [
  {
    q: "印尼看護一定是穆斯林嗎？",
    a: "不一定。印尼多數人信仰伊斯蘭教，但也有基督徒、天主教徒、印度教徒等。就算是穆斯林，每個人遵守的程度也不同。最好的方法是直接、客氣地問她：有沒有不能吃的東西？",
  },
  {
    q: "可以請她煮豬肉給長輩吃嗎？",
    a: "每個人能接受的程度不同，有人可以戴手套處理，有人不願意。請在一開始就問清楚、互相商量，也可以由家人煮或買現成的。不要勉強她，更不要讓她吃。工作內容依契約約定。",
  },
  {
    q: "齋戒月期間她還能照顧長輩嗎？",
    a: "可以，很多看護齋戒月照常工作。白天她不吃不喝，雇主可以讓她日出前、日落後方便準備自己的餐，避免安排太耗體力的工作，注意她的身體狀況。長輩的三餐和吃藥時間照常。",
  },
  {
    q: "伙食費要另外給還是包在家用金裡？",
    a: "建議分開。伙食費是她自己的三餐，固定給就好；家用金是家裡的開銷，要每筆記帳。混在一起，月底一定對不起來。伙食怎麼提供、要不要另外給錢，依勞動契約約定，不確定問仲介或 1955。",
  },
  {
    q: "開齋節她想放假怎麼辦？",
    a: "開齋節是穆斯林最重要的節日之一，很多看護會希望那天休假或跟同鄉聚會。休假和出勤怎麼處理，依勞動契約與勞動部規定。建議提早一兩個月就討論，並安排好那幾天的替代照顧。",
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
            家裡請了印尼看護，很多雇主第一個問題是：「她不吃豬肉，那三餐怎麼辦？」其實不難。只要先了解<strong>清真飲食的基本原則</strong>，再跟她商量好<strong>三餐怎麼煮、伙食費怎麼給</strong>，大部分家庭都能吃得很和氣。下面一次整理，包括齋戒月要注意什麼。
          </P>
          <P>
            先說最重要的一句：<strong>不要猜，直接問她</strong>。每個人的信仰和習慣不同，她最清楚自己能吃什麼。
          </P>

          <H2 id="basics">清真飲食的基本原則</H2>
          <P>清真（Halal）是伊斯蘭教的飲食規範。對台灣家庭來說，最常遇到的是這幾點：</P>
          <div className="mt-4 space-y-3">
            {BASICS.map(([name, desc]) => (
              <div key={name} className="card">
                <p className="text-lg font-bold">{name}</p>
                <p className="mt-2 text-[17px] leading-7 text-muted">{desc}</p>
              </div>
            ))}
          </div>
          <P>
            這不是挑食，而是信仰。尊重她的飲食，就像我們不會勉強吃素的家人吃肉一樣。她能安心吃飯，才有體力照顧長輩。
          </P>

          <H2 id="cooking">三餐怎麼安排？三種常見方式</H2>
          <div className="mt-4 space-y-4">
            {COOKING.map((c) => (
              <div key={c.t} className="card">
                <p className="text-xl font-extrabold">{c.t}</p>
                <p className="mt-3 text-[17px] leading-7"><span className="font-bold">怎麼做：</span>{c.how}</p>
                <p className="mt-2 text-[17px] leading-7"><span className="font-bold">適合誰：</span>{c.fit}</p>
                <p className="mt-2 text-[17px] leading-7"><span className="font-bold">提醒：</span>{c.note}</p>
              </div>
            ))}
          </div>
          <P>
            不管哪一種方式，都可以幫她準備<strong>一套自己的鍋子、砧板和碗筷</strong>。冰箱裡她的食物可以放在固定的一層，避免和豬肉製品混在一起。
          </P>

          <H2 id="ramadan">齋戒月：要注意什麼</H2>
          <P>
            齋戒月（Ramadan）是伊斯蘭曆的第九個月，大約一個月。期間穆斯林從日出前到日落都不吃不喝，日落後才開齋吃飯。日期每年往前移，依伊斯蘭曆和各地宣布為準；2027 年預計大約落在 2 月上旬到 3 月上旬，和農曆年很接近，可以一起規劃。
          </P>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-lg leading-8">
            <li>她可能會在天亮前起來吃一餐，晚上日落後再吃。廚房和時間讓她方便使用。</li>
            <li>白天不吃不喝，體力會比較差。粗重或長時間在外的工作，可以盡量安排在早上或改天。</li>
            <li>長輩的三餐、吃藥時間照常，她照樣可以準備，只是自己不吃。</li>
            <li>開齋常吃椰棗、甜點和比較豐盛的晚餐，伙食費可以考慮這個月多給一些。</li>
            <li>齋戒月結束是開齋節（Lebaran），休假和出勤依勞動契約約定，提早討論。</li>
          </ul>
          <P>
            另外，穆斯林一天有五次禮拜，每次時間不長。可以讓她在房間或安靜的角落進行，不影響照顧就好。
          </P>

          <H2 id="budget">伙食費怎麼給？跟家用金分開</H2>
          <P>
            她如果另外煮自己的三餐，最常見的做法是<strong>每月固定給一筆伙食費</strong>，讓她自己買。清真食材有時要到印尼商店或特定超市買，讓她自己安排最省事。伙食怎麼提供、要不要另外給錢，請依勞動契約約定，<strong>不要自行從薪水扣</strong>。
          </P>
          <div className="mt-4 space-y-3">
            {MONEY.map(([name, desc]) => (
              <div key={name} className="card">
                <p className="text-lg font-bold">{name}</p>
                <p className="mt-2 text-[17px] leading-7 text-muted">{desc}</p>
              </div>
            ))}
          </div>
          <P>
            一個月大概要準備多少，每個家庭差很多，可以參考{" "}
            <Link href="/guide/caregiver-food-and-household-cash-per-month" className="font-bold text-accent-ink underline underline-offset-4">外籍看護伙食費、家用金一個月多少？三種錢分清楚</Link>；家用金怎麼給，請看{" "}
            <Link href="/guide/how-employers-give-grocery-money" className="font-bold text-accent-ink underline underline-offset-4">家庭移工買菜怎麼給錢？6 種常見方式比較</Link>。
          </P>

          <H2 id="where">清真食材哪裡買？</H2>
          <P>
            很多地方都有印尼商店，賣香料、調味料、泡麵和清真肉品；大賣場和部分超市也有清真認證的商品。最簡單的方法是問她，她通常會從同鄉那裡知道附近哪裡買得到。剛來的第一週，可以順便帶她去認識一下，請看{" "}
            <Link href="/guide/first-week-with-new-caregiver" className="font-bold text-accent-ink underline underline-offset-4">看護來了！第一週清單</Link>。
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
            <p className="text-2xl font-extrabold">伙食費、家用金，分開記清楚</p>
            <p className="mt-3 text-lg text-muted">
              CareCash 家用金：看護用印尼文、越南文等母語拍收據記帳，給錢、補錢雙方確認，餘額自動算好，兄弟姊妹也能一起看。
            </p>
            <div className="mx-auto mt-5 max-w-xs">
              <Link href="/sign-in?mode=signup&ref=guide-halal" className="btn-primary">免費開始使用</Link>
            </div>
            <Link href="/sign-in#demo" className="mt-3 inline-block text-base font-semibold text-accent-ink underline underline-offset-4">先不註冊，試用範例家庭</Link>
          </div>

          <ShareArticle url={`${SITE_URL}/guide/${A.slug}?ref=share`} title={A.title} />

          <RelatedArticles current={A.slug} />

          <p className="mt-10 text-sm text-muted">
            本文為一般性的生活建議，不構成法律或宗教意見；伙食、休假與工作內容的約定，請以勞動契約、勞動部規定及您的仲介說明為準，不確定時可撥 1955 專線詢問。宗教與飲食習慣因人而異，請以看護本人的意見為準。
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

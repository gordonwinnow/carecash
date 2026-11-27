import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { SiteFooter, SiteHeader } from "../../landing";
import { article } from "../articles";

const A = article("first-week-with-new-caregiver")!;

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

const BEFORE = [
  ["她的房間", "乾淨的床、棉被枕頭、可以上鎖的櫃子或抽屜、衣架和插座。房間不一定要大，但要是她可以安心休息、放私人物品的地方。"],
  ["網路與手機", "家裡 Wi-Fi 密碼先寫好。她每天最想做的事，多半是跟家人視訊報平安；能順利連上網路，她會安心很多。"],
  ["長輩的照顧重點", "吃什麼、不能吃什麼、吃哪些藥、幾點吃、行動上要注意什麼、半夜常起來幾次。寫在一張紙上，比口頭講十遍有用。"],
  ["緊急聯絡方式", "家人的電話、仲介的電話、附近醫院和 119。貼在冰箱或電話旁邊，她不用找。"],
  ["第一筆家用金", "先想好一週大概給多少、放在哪裡、收據放哪裡。金額還不確定沒關係，先給一筆，三週後再調整。"],
];

const DAYS = [
  {
    d: "第 1 天",
    t: "讓她先休息、認識家人",
    items: ["介紹家人和長輩，告訴她每個人怎麼稱呼。", "帶她看房間、浴室、廚房，說明熱水器、洗衣機怎麼用。", "給她 Wi-Fi 密碼，讓她先跟家人報平安。", "不要第一天就把所有規矩講完，她剛下飛機或剛轉換雇主，很累也很緊張。"],
  },
  {
    d: "第 2–3 天",
    t: "一起照顧長輩、示範一次",
    items: ["家人陪著做一輪：起床、盥洗、餵藥、三餐、翻身或散步、洗澡、睡前。", "長輩的習慣和偏好，邊做邊講，例如喜歡吃軟一點、怕冷。", "把照顧重點那張紙一起看一遍，不懂的地方用翻譯軟體確認。"],
  },
  {
    d: "第 3–4 天",
    t: "帶她去買一次菜",
    items: ["帶她去附近的市場、超市、藥局，認識路。", "告訴她家裡常買什麼、大概多少錢、哪些東西不用買（例如雇主網購的尿布）。", "示範一次怎麼拿收據、怎麼拍照記帳。"],
  },
  {
    d: "第 5 天",
    t: "把家用金交接清楚",
    items: ["當面點清第一筆家用金，雙方確認金額。", "說好剩多少要補、怎麼通知你補錢。", "說好每週哪一天對帳。"],
  },
  {
    d: "第 6–7 天",
    t: "坐下來聊一次",
    items: ["問她有沒有不習慣、不清楚的地方，吃得習不習慣。", "確認休息時間和休假怎麼安排。", "第一週的帳一起對一次，有問題現在講開最好。"],
  },
];

const RULES = [
  ["作息時間", "長輩幾點起床、幾點吃藥、幾點睡；她什麼時候可以休息。"],
  ["家裡的習慣", "鞋子放哪裡、垃圾怎麼分類、幾點倒垃圾、哪些房間不用打掃。"],
  ["採買與家用金", "誰負責買什麼、家用金放哪裡、收據怎麼留、多久對帳一次。"],
  ["要先問過的事", "帶朋友回家、晚上出門、使用家裡的東西。說清楚，比事後責怪好。"],
  ["緊急狀況", "長輩跌倒、不舒服、停電時，先打給誰、怎麼做。"],
];

const MONEY = [
  ["給一筆固定週轉金", "每週或每兩週先給一筆，用完前補回原本的金額。不要讓她第一週就自己先墊錢。"],
  ["每筆拍收據", "沒有收據的菜攤，就寫下買了什麼、多少錢。她用自己的語言記也可以，重點是有紀錄。"],
  ["交接雙方確認", "給錢、補錢、找零都當面點清，雙方確認金額。"],
  ["每週對帳一次", "給的錢＝花掉的錢＋手上剩的錢。對不上先一起看收據，不要懷疑她。"],
];

const FAQ = [
  {
    q: "第一週家用金要給多少？",
    a: "每個家庭差很多，沒有標準答案。可以先給一筆你覺得夠一週的金額，請她每筆記帳，三週後看實際花多少再調整。重點是讓她手上一直有錢可以用，不要讓她自己先墊。",
  },
  {
    q: "她的護照、居留證可以由雇主保管嗎？",
    a: "不可以違反她的意願扣留護照、居留證等證件，這是法律明文禁止的。證件請讓她自己保管；如果她主動請你代為保管，也要尊重她隨時拿回的權利。詳細規定請依勞動部說明，不確定問仲介或 1955。",
  },
  {
    q: "可以規定她不能用手機嗎？",
    a: "手機是她跟家人聯絡的唯一方式。可以一起討論工作時間的使用原則，例如照顧長輩時專心，休息時間自由使用，但不要沒收或全面禁止。",
  },
  {
    q: "休假怎麼安排？",
    a: "休息日和休假怎麼安排、若休息日出勤怎麼處理，要依勞動契約與勞動部規定。第一週就把這件事講清楚，包括她休假時誰來照顧長輩。不確定的話，問仲介或撥 1955 專線。",
  },
  {
    q: "語言不通怎麼溝通？",
    a: "翻譯軟體、圖片、比手畫腳都可以。重要的事（吃藥、緊急狀況、家用金）寫下來、翻譯好，貼在固定的地方。記帳也可以讓她用自己的母語記，雇主看中文，比雙方硬用不熟的語言溝通清楚得多。",
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
            看護終於要來了。接下來的第一週，會決定你們之後幾年怎麼相處。很多後來的誤會，例如「錢怎麼用這麼快」「她怎麼都不說」，其實都是第一週沒講清楚。這份清單分成<strong>到之前要準備的</strong>、<strong>第 1 到 7 天每天做什麼</strong>、<strong>一張家規表</strong>和<strong>家用金怎麼開始</strong>，照著做，雙方都比較安心。
          </P>
          <P>
            先記得一件事：她離開家人、來到一個陌生的家，比你還緊張。第一週不用急著把所有事情教完，<strong>先讓她安心，再慢慢上手</strong>。
          </P>

          <H2 id="before">到之前：先準備這五件事</H2>
          <div className="mt-4 space-y-3">
            {BEFORE.map(([name, desc]) => (
              <div key={name} className="card">
                <p className="text-lg font-bold">{name}</p>
                <p className="mt-2 text-[17px] leading-7 text-muted">{desc}</p>
              </div>
            ))}
          </div>

          <H2 id="days">第 1 到 7 天清單</H2>
          <P>不用每天照表操課，順序可以依你家的情況調整。重點是每一件事都有人帶她做過一次。</P>
          <div className="mt-4 space-y-4">
            {DAYS.map((x) => (
              <div key={x.d} className="card">
                <p className="text-xl font-extrabold">{x.d}：{x.t}</p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-[17px] leading-7">
                  {x.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <H2 id="rules">一張家規表：寫下來、翻譯好</H2>
          <P>
            口頭講的，她可能聽不懂也不好意思問。把家裡的規矩寫成一張表，用翻譯軟體翻成她的語言，中文和她的語言並排，貼在她看得到的地方。家規表建議包括：
          </P>
          <div className="mt-4 space-y-3">
            {RULES.map(([name, desc]) => (
              <div key={name} className="card">
                <p className="text-lg font-bold">{name}</p>
                <p className="mt-2 text-[17px] leading-7 text-muted">{desc}</p>
              </div>
            ))}
          </div>
          <P>家規表不是用來管她的，是讓她知道這個家怎麼運作。內容要合理，也要在契約約定的工作範圍內。</P>

          <H2 id="money">家用金：第一週就把習慣建立起來</H2>
          <P>
            錢的事最容易傷感情，也最適合在一開始就講清楚。第一週把下面四件事建立起來，之後幾乎不用再為錢煩惱：
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
            還有一點：<strong>薪水、她的伙食費、家用金要分開</strong>。薪水依契約給付，家用金是家裡的開銷，混在一起就一定對不起來。想看更完整的做法，請看{" "}
            <Link href="/guide/household-cash-for-caregivers" className="font-bold text-accent-ink underline underline-offset-4">第一次請外籍看護：家用金怎麼給、怎麼記帳</Link>；不確定用哪種方式給錢，可以參考{" "}
            <Link href="/guide/how-employers-give-grocery-money" className="font-bold text-accent-ink underline underline-offset-4">家庭移工買菜怎麼給錢？6 種常見方式比較</Link>。
          </P>

          <H2 id="language">語言工具：不用很厲害，夠用就好</H2>
          <P>
            手機的翻譯軟體已經很好用，可以直接講話翻譯，也可以拍照翻譯菜單、藥袋。幾個小技巧：句子講短一點、一次講一件事；重要的事請她用自己的話說一遍，確認她真的懂；常用的句子（吃藥了嗎、要買什麼、錢夠不夠）可以先翻好存起來。
          </P>
          <P>
            記帳也一樣。讓她用自己熟悉的語言記，比要求她寫中文準確得多。
          </P>

          <H2 id="respect">尊重與隱私</H2>
          <P>
            她是來工作的，也是住在你家的一個人。她的房間、手機、私人物品，請尊重她的隱私；護照、居留證等證件，依規定不可以違反她的意願扣留。她的宗教和飲食習慣也要事先問清楚，例如印尼的穆斯林看護不吃豬肉，可以參考{" "}
            <Link href="/guide/caregiver-food-and-halal" className="font-bold text-accent-ink underline underline-offset-4">印尼看護的飲食：清真、三餐安排與伙食費</Link>。
          </P>

          <H2 id="days-off">休息與休假：第一週就講好</H2>
          <P>
            每天什麼時候可以休息、休息日怎麼安排、休假時誰來照顧長輩，第一週就要講好。休息日、休假和出勤怎麼處理，<strong>依勞動契約與勞動部規定</strong>，不確定的話，問仲介或撥 1955 專線。如果家裡有兄弟姊妹，可以先排好輪流接手的人，也可以參考{" "}
            <Link href="/guide/siblings-sharing-parent-care-costs" className="font-bold text-accent-ink underline underline-offset-4">兄弟姊妹分攤爸媽的看護費、家用金</Link>。
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
            <p className="text-2xl font-extrabold">第一週，就把家用金的習慣建立好</p>
            <p className="mt-3 text-lg text-muted">
              CareCash 家用金：看護用印尼文、越南文等母語拍收據記帳，給錢、補錢雙方確認，餘額自動算好，兄弟姊妹也能一起看。
            </p>
            <div className="mx-auto mt-5 max-w-xs">
              <Link href="/sign-in?mode=signup&ref=guide-firstweek" className="btn-primary">免費開始使用</Link>
            </div>
          </div>

          <p className="mt-10 text-sm text-muted">
            本文為一般性的生活建議，不構成法律意見；薪資、休息日、休假、證件保管與工作內容的約定，請以勞動契約、勞動部規定及您的仲介說明為準，不確定時可撥 1955 專線詢問。
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

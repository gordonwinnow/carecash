import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { SiteFooter, SiteHeader } from "../../landing";
import { RelatedArticles } from "../related";
import { ShareArticle } from "../share";

const A = {
  slug: "caregiver-replacement-handover",
  title: "換看護、看護回國：家用金與帳目怎麼交接",
  description:
    "看護期滿回國、轉換雇主或換人，家用金怎麼收尾？整理離開前的最後一次對帳、現金歸還、家裡欠她的錢怎麼結清、收據歸檔，以及新看護到之後怎麼重新開始。",
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

const TIMELINE = [
  ["離開前一到兩週", "確定最後工作日；停止補大筆週轉金，只補到夠用；請她把還沒記的收據補記、把先墊的錢列出來。"],
  ["離開前兩三天", "做最後一次對帳：算出帳上應有的餘額，點清手上的現金，結清家裡欠她的每一筆錢。"],
  ["最後一天", "現金歸還、雙方確認；她的私人物品、證件都在她自己手上；收據和帳目歸檔。好好道別。"],
  ["新看護到之後", "從新的一本帳開始：新的週轉金、點清、雙方確認。舊看護的餘額不要直接「轉」給新看護。"],
];

const OWED = [
  ["她先墊、還沒還的錢", "買菜、買藥、搭車先付的錢，有收據或紀錄的，最後一次對帳時全部還清。"],
  ["最後一期薪水", "依契約約定的日期與金額給付，給了多少、扣了什麼，在薪資單上寫清楚。"],
  ["休息日出勤、加班的工資", "如果有休息日或國定假日出勤還沒結算的，依契約與勞動部規定一併處理。"],
  ["其他約定的款項", "例如伙食費、契約約定的其他費用。怎麼算以契約為準，有疑問先問仲介。"],
];

const FAQ = [
  {
    q: "最後對帳，家用金少了一些，可以從最後一期薪水扣嗎？",
    a: "不要自行從薪水扣錢。薪水依勞動契約與勞動部規定給付，家用金是另一筆帳。帳對不上，先一起看收據和紀錄找原因；小差額常常只是漏記一張收據。有爭議的話，請仲介協助，或撥 1955 專線詢問。",
  },
  {
    q: "看護手上的家用金，可以直接交給新看護嗎？",
    a: "不建議。舊看護要先把錢交回給雇主，雙方點清、確認，這本帳才算結束。新看護來了，再由雇主給她一筆新的週轉金，從零開始記。這樣兩個人的帳不會混在一起，日後有疑問也查得到。",
  },
  {
    q: "收據要留多久？",
    a: "沒有一定的規定，看家裡的需要。建議至少把最後幾個月的收據、對帳結果拍照存好，兄弟姊妹之間要分攤費用、或日後有疑問時，都查得到。",
  },
  {
    q: "看護的護照、居留證要等交接完才還嗎？",
    a: "不可以。違反她的意願扣留護照、居留證等證件，是法律明文禁止的；證件本來就應該由她自己保管。交接是否完成，和她的證件無關。詳細規定請依勞動部說明，不確定問仲介或 1955。",
  },
  {
    q: "可以請舊看護教新看護嗎？",
    a: "如果時間剛好有重疊，可以請她把長輩的習慣、吃藥時間、常去的市場整理給新看護，這對長輩最好。沒有重疊的話，請舊看護在離開前寫下來或錄一段說明，家人再轉述。",
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
            看護期滿要回國、轉換到別的雇主，或是因為各種原因要換人，家裡要處理的事很多：仲介手續、新看護什麼時候到、長輩這段時間誰照顧。<strong>家用金和帳目</strong>常常被放到最後，結果最後一天才發現錢對不起來、她先墊的錢還沒還、收據不知道丟到哪裡。
          </P>
          <P>
            好好收尾，對雙方都重要：她可以安心離開，不會帶著「錢沒算清楚」的委屈；家裡也有一份完整的紀錄，新看護來了可以乾淨地重新開始。下面依時間順序整理該做的事。
          </P>

          <H2 id="timeline">交接時間表</H2>
          <div className="mt-4 space-y-3">
            {TIMELINE.map(([t, d]) => (
              <div key={t} className="card">
                <p className="text-lg font-bold">{t}</p>
                <p className="mt-2 text-[17px] leading-7 text-muted">{d}</p>
              </div>
            ))}
          </div>

          <H2 id="settle">1. 最後一次對帳：結清家用金餘額</H2>
          <P>
            離開前兩三天，找一個雙方都有空的時間，一起坐下來對帳。公式和平常一樣：
          </P>
          <div className="card mt-6">
            <p className="text-lg font-bold">上次對帳剩下＋之後給的錢－之後花的錢＝帳上應有的餘額</p>
            <p className="mt-3 text-[17px] leading-7 text-muted">
              再把她手上的家用金點清。兩個數字一樣，這本帳就結清了；如果帳上的餘額是負的，代表她先墊了錢，家裡要還她。
            </p>
          </div>
          <P>
            點清之後，<strong>剩下的現金當面交回</strong>給雇主或負責家用金的家人，雙方說出金額、確認，最好留下一筆紀錄，例如在帳本上寫「某月某日，歸還家用金多少元，雙方確認」。不要等到最後一天匆忙處理，那天她要整理行李、道別，很容易漏掉。
          </P>
          <P>
            如果平常就有每週對帳的習慣，最後一次通常幾分鐘就對完了。還沒有這個習慣的話，可以參考{" "}
            <A_ href="/guide/household-cash-for-caregivers">第一次請外籍看護：家用金怎麼給、怎麼記帳</A_>。
          </P>

          <H2 id="owed">2. 家裡欠她的錢，一筆一筆結清</H2>
          <P>交接時大家常只想到「她手上有多少家裡的錢」，卻忘了反過來：<strong>家裡有沒有欠她錢？</strong>常見的有這幾筆：</P>
          <div className="mt-4 space-y-3">
            {OWED.map(([t, d]) => (
              <div key={t} className="card">
                <p className="text-lg font-bold">{t}</p>
                <p className="mt-2 text-[17px] leading-7 text-muted">{d}</p>
              </div>
            ))}
          </div>
          <P>
            要特別注意：<strong>家用金和薪水是兩筆帳</strong>。家用金有差額，不能拿來抵她的薪水或她先墊的錢。她要回國的話，這些錢在她離開台灣前就要給清，之後要再處理會很麻煩。先墊的錢怎麼處理才公平，請看{" "}
            <A_ href="/guide/caregiver-pays-first-reimbursement">看護先墊錢怎麼辦？先墊後報的公平做法</A_>。
          </P>

          <H2 id="archive">3. 收據與帳目歸檔</H2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-lg leading-8">
            <li>把最後幾個月的紙本收據收進一個信封，寫上看護的名字和期間。</li>
            <li>紙本收據容易褪色，重要的拍照存在手機或雲端。</li>
            <li>最後一次對帳的結果（餘額、歸還金額、還她的錢）寫下來，雙方確認。兄弟姊妹一起分攤的話，貼一份給大家看。</li>
          </ul>
          <P>這份紀錄不是為了防她，而是讓這段合作有個清楚的結尾，日後任何一方有疑問，都有東西可以查。</P>

          <H2 id="dispute">4. 帳對不起來怎麼辦？</H2>
          <P>
            先一起找原因：漏記的收據、家人臨時拿去用的錢、沒有寫下來的零錢。很多時候差額只有幾十、幾百元，找不到原因的話，<strong>小差額就放下吧</strong>，不值得讓一段好幾年的照顧關係在最後一天鬧僵。
          </P>
          <P>
            差額比較大、雙方各執一詞時，不要在最後一天爭吵，也不要自行扣薪或扣她的東西。請仲介協助協調，或撥勞動部 <strong>1955 專線</strong>（免費、24 小時、有多種語言服務）詢問。
          </P>

          <H2 id="new">5. 新看護來了：從一本新帳開始</H2>
          <P>
            新看護到家，家用金<strong>從零開始</strong>：由雇主給她一筆新的週轉金，當面點清、雙方確認。一開始就把規則講清楚，例如每週給多少、剩多少要補、收據怎麼留、哪天對帳。給錢的方式可以參考{" "}
            <A_ href="/guide/how-employers-give-grocery-money">家庭移工買菜怎麼給錢？6 種常見方式比較</A_>。
          </P>
          <P>
            不要拿新看護和舊看護比：「之前那位一週只花兩千」。每個人採買習慣不同，長輩的狀況也會變。前三週照實記錄，再一起調整金額就好。第一週要準備什麼，請看{" "}
            <A_ href="/guide/first-week-with-new-caregiver">看護來了！第一週清單</A_>。
          </P>

          <H2 id="carecash">用 CareCash 交接</H2>
          <P>
            如果你用 CareCash 家用金，交接會簡單一些：帳上的餘額一直都是自動算好的，最後一次對帳只要點清現金、看數字對不對。每筆支出的收據照片按月份整理，修改紀錄也都留著。新看護來了，再邀請一位看護，傳一個連結，她用自己的語言加入；每位看護各有自己的家用金餘額，不會和舊看護的帳混在一起。建議先把舊看護的帳對完、結清，再把她從家庭成員中移除。
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
            <p className="text-2xl font-extrabold">好好結束，乾淨地重新開始</p>
            <p className="mt-3 text-lg text-muted">
              CareCash 家用金：看護用母語拍收據記帳，交錢雙方確認，餘額自動算好。換看護時，每位看護各有自己的帳，不會混在一起。
            </p>
            <div className="mx-auto mt-5 max-w-xs">
              <Link href="/sign-in?mode=signup&ref=guide-handover" className="btn-primary">免費開始使用</Link>
            </div>
            <Link href="/sign-in#demo" className="mt-3 inline-block text-base font-semibold text-accent-ink underline underline-offset-4">先不註冊，試用範例家庭</Link>
          </div>

          <ShareArticle url={`${SITE_URL}/guide/${A.slug}?ref=share`} title={A.title} />

          <RelatedArticles current={A.slug} />

          <p className="mt-10 text-sm text-muted">
            本文為一般性的生活建議，不構成法律意見；薪資、工資結算、證件保管與契約終止的相關規定，請以勞動契約、勞動部規定及您的仲介說明為準，不確定時可撥 1955 專線詢問。
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

import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { SiteFooter, SiteHeader } from "../../landing";
import { article } from "../articles";
import { RelatedArticles } from "../related";
import { ShareArticle } from "../share";

const A = article("lunar-new-year-caregiver-holiday-money")!;

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
    q: "過年看護一定要放假嗎？",
    a: "要看勞動契約怎麼約定。有些看護選擇過年休假，有些願意留下來工作；若國定假日出勤，依勞動契約與勞動部規定應另給工資或補假。實際怎麼算，請以契約為準，不確定時問仲介或撥 1955 專線。",
  },
  {
    q: "過年要給看護紅包嗎？要給多少？",
    a: "紅包不是規定，是一份心意。很多家庭過年會包個紅包謝謝看護一年的辛苦，金額由家裡自己決定。紅包請和薪水、加班費分開，不要用紅包代替應付的工資。",
  },
  {
    q: "看護過年休假，誰來照顧爸媽？",
    a: "可以由家人輪流照顧，也可以提早撥 1966 長照專線詢問喘息服務或其他替代照顧。過年期間服務名額可能比較緊，資格依長照評估與規定，越早詢問越好。",
  },
  {
    q: "過年家用金要多給嗎？",
    a: "通常會比平常多。過年前市場人潮多、部分食材會漲價，年節期間不少店家休息，最好在年前多給一些週轉金，讓看護提早採買，並照常保留收據。",
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
            2027 年農曆春節是 <strong>2 月 6 日</strong>，除夕是 <strong>2 月 5 日</strong>。對家裡有外籍看護的家庭來說，過年要想的不只是年菜：看護要不要放假？留下來工作怎麼給薪？紅包要不要包？家用金要多準備多少？這篇幫你一次整理，<strong>提早一個月開始安排</strong>，過年就能輕鬆很多。
          </P>

          <H2 id="early">提早一個月，先問三件事</H2>
          <P>建議在一月初就找時間跟看護好好聊一次，必要時請仲介協助翻譯：</P>
          <div className="mt-4 space-y-3">
            {[
              ["她想怎麼過年？", "想休假、想留下來工作，還是休幾天就好？不要假設，直接問。"],
              ["家裡誰能接手？", "如果她休假，那幾天由哪位家人照顧，或需要申請替代照顧。"],
              ["錢怎麼安排？", "出勤的工資或補假、紅包、年前的家用金，事先講清楚。"],
            ].map(([name, how]) => (
              <div key={name} className="card">
                <p className="text-xl font-extrabold">{name}</p>
                <p className="mt-1 text-[17px] leading-7">{how}</p>
              </div>
            ))}
          </div>
          <P>談好之後，把結果寫下來（日期、誰照顧、怎麼給錢），傳給家人和看護各一份，避免過年前才發現大家記得不一樣。</P>

          <H2 id="leave">放假，還是過年也上班？</H2>
          <P>這是過年最重要的決定，兩種都很常見：</P>
          <div className="mt-4 space-y-3">
            <div className="card">
              <p className="text-xl font-extrabold">選擇一：看護過年休假</p>
              <p className="mt-1 text-[17px] leading-7">家人或替代照顧要事先排好。休假日期、何時回來、要不要外宿，都先確認。</p>
            </div>
            <div className="card">
              <p className="text-xl font-extrabold">選擇二：看護過年照常工作</p>
              <p className="mt-1 text-[17px] leading-7">
                依勞動契約與勞動部規定，<strong>國定假日出勤應另給工資或補假</strong>。實際怎麼計算、補假怎麼排，請以你們簽的勞動契約為準。
              </p>
            </div>
          </div>
          <P>
            計算方式有疑問，請先問仲介，或撥打勞動部 <strong>1955 專線</strong>（有多種語言服務）確認，不要自己猜。出勤的工資請和薪水一起清楚記錄在薪資單上。
          </P>

          <H2 id="hongbao">紅包：一份心意，不是規定</H2>
          <P>
            很多台灣家庭過年會包個紅包給看護，謝謝她這一年的照顧。這不是法律規定，<strong>金額多少由家裡自己決定</strong>，心意比數字重要。幾個小提醒：
          </P>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-lg leading-8">
            <li>紅包和薪水、出勤工資<strong>分開給</strong>，不要用紅包代替應付的工資。</li>
            <li>紅包也不要從家用金裡拿，家用金只用在家裡的開銷，帳才對得起來。</li>
            <li>兄弟姊妹若要一起包，先講好誰出多少，避免事後尷尬。</li>
          </ul>

          <H2 id="cash">年前多準備家用金</H2>
          <P>過年前後家用金通常會比平常多，原因很簡單：</P>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-lg leading-8">
            <li>年前市場人多，部分蔬菜、海鮮、肉類常會漲價。</li>
            <li>除夕到初幾，很多市場和店家休息，要提早囤貨。</li>
            <li>要準備年菜、拜拜用品，以及長輩的尿布、藥品等存量。</li>
          </ul>
          <P>
            建議在<strong>年前一到兩週</strong>多給一筆週轉金，請看護列一張採買清單，跟家人確認後再買。長輩的藥要記得在醫院、診所休診前先拿好。每一筆照樣<strong>拍收據記帳</strong>，過年後對帳才清楚。
          </P>

          <H2 id="respite">看護休假時的替代照顧</H2>
          <P>
            如果看護休假、家人又無法全程照顧，可以撥 <strong>1966 長照專線</strong>，詢問喘息服務或其他替代照顧方式。是否符合資格、可以用幾天，依長照評估結果與相關規定而定。過年是需求高峰，<strong>越早詢問越好</strong>，最好一個月前就開始聯絡。
          </P>

          <H2 id="settle">她出門前，先把家用金結清</H2>
          <P>如果看護過年要休假或外宿，出門前花 5 分鐘把家用金對清楚：</P>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-lg leading-8">
            <li>把收據整理好，確認最近的支出都已經記帳。</li>
            <li>點清剩下的現金，和帳上的餘額對一對。</li>
            <li>剩下的錢交還給家人，或雙方確認由她保管，並留下紀錄。</li>
            <li>她回來那天，再交一筆新的週轉金，雙方確認。</li>
          </ol>
          <P>這樣她放假時不必擔心身上的錢，家人也不用在過年期間猜「錢還剩多少」。</P>

          <H2 id="eid">穆斯林看護，也有自己的節日</H2>
          <P>
            許多印尼籍看護是穆斯林。對她們來說，<strong>齋戒月與開齋節</strong>（Eid al-Fitr）可能比農曆年更重要。這些節日依伊斯蘭曆而定，每年日期不同，2027 年的齋戒月預計會在農曆年前後開始，確切日期請以當年公告為準。
          </P>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-lg leading-8">
            <li>提早問她今年的節日日期，以及希望怎麼過。</li>
            <li>齋戒期間白天不吃喝，工作安排可以體貼一點，年菜也不要勉強她吃不能吃的食物。</li>
            <li>開齋節的休假或出勤，同樣依勞動契約約定，和農曆年一起規劃。</li>
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
            第一次幫看護準備家用金？請看{" "}
            <Link href="/guide/household-cash-for-caregivers" className="font-bold text-accent-ink underline underline-offset-4">第一次請外籍看護：家用金怎麼給、怎麼記帳</Link>。
          </P>

          <div className="card mt-12 p-6 text-center">
            <p className="text-2xl font-extrabold">過年的帳，也交給手機</p>
            <p className="mt-3 text-lg text-muted">
              CareCash 家用金：看護拍收據記帳、給錢雙方確認，餘額自動算好，放假前對帳一下就清楚。看護可以用印尼文、越南文、菲律賓文、泰文等母語操作，兄弟姊妹也能共用一個帳本。
            </p>
            <div className="mx-auto mt-5 max-w-xs">
              <Link href="/sign-in?mode=signup&ref=guide-cny" className="btn-primary">免費開始使用</Link>
            </div>
            <Link href="/sign-in#demo" className="mt-3 inline-block text-base font-semibold text-accent-ink underline underline-offset-4">先不註冊，試用範例家庭</Link>
          </div>

          <ShareArticle url={`${SITE_URL}/guide/${A.slug}?ref=share`} title={A.title} />

          <RelatedArticles current={A.slug} />

          <p className="mt-10 text-sm text-muted">
            本文為一般性的生活建議，不構成法律意見；休假、國定假日出勤工資與補假，請以勞動契約、勞動部公告及您的仲介說明為準。
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

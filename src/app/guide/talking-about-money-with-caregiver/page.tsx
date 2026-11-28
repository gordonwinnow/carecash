import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { SiteFooter, SiteHeader } from "../../landing";
import { RelatedArticles } from "../related";
import { ShareArticle } from "../share";

const A = {
  slug: "talking-about-money-with-caregiver",
  title: "跟看護談錢不尷尬：10 句中印對照常用句",
  description:
    "給家用金、請看護拿收據、錢快用完要補、每週對帳、帳對不上時怎麼問、誤會了怎麼道歉：10 句中文與印尼文對照的常用句，附語氣提醒與常見問題。",
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

type Phrase = { n: number; when: string; zh: string; id: string; tip: string };

// TODO(native review): every `id` string below (Bahasa Indonesia) was written by a non-native
// speaker and should be checked by a native Indonesian speaker for naturalness and politeness
// before wider promotion. Keep the tone respectful (polite "tolong", "ya", no commands).
const PHRASES: Phrase[] = [
  {
    n: 1,
    when: "給家用金的時候",
    zh: "這是這個星期的家用金，三千元，請你數一下。",
    id: "Ini uang belanja untuk minggu ini, NT$3.000. Tolong dihitung dulu, ya.",
    tip: "當面數，對雙方都是保障。金額換成你家的實際數字；用 CareCash 的話，她數完按「我收到了」，這筆就記下來了。",
  },
  {
    n: 2,
    when: "說明家用金不是薪水",
    zh: "這是買家裡東西的錢，不是薪水。薪水我會另外給你。",
    id: "Ini uang untuk belanja keperluan rumah, bukan gaji. Gajimu saya berikan terpisah.",
    tip: "第一次給家用金時就說清楚，她才不會擔心這筆錢跟薪水混在一起。",
  },
  {
    n: 3,
    when: "請她拿收據",
    zh: "買東西的時候請拿收據，拍照記下來就好。",
    id: "Kalau belanja, tolong minta struknya, lalu difoto dan dicatat, ya.",
    tip: "重點是「拍照記下來」，不是「交給我檢查」。說成一個習慣，而不是一種懷疑。",
  },
  {
    n: 4,
    when: "沒有收據的時候",
    zh: "菜市場沒有收據沒關係，寫下買了什麼、多少錢就可以。",
    id: "Kalau di pasar tidak ada struk, tidak apa-apa. Cukup tulis beli apa dan berapa harganya.",
    tip: "傳統市場和小攤販常常沒有收據。先說「沒關係」，她才不會因為拿不到收據而不敢去市場買。",
  },
  {
    n: 5,
    when: "請她錢快用完時直接說",
    zh: "錢快用完的時候，請直接跟我說，不用不好意思。",
    id: "Kalau uangnya hampir habis, langsung bilang ke saya saja, ya. Tidak usah sungkan.",
    tip: "很多看護不好意思開口要錢。「sungkan」就是「不好意思、客氣」的意思，這句可以讓她放心。",
  },
  {
    n: 6,
    when: "請她不要自己墊錢",
    zh: "不要用你自己的錢先付。錢不夠的話，先告訴我。",
    id: "Jangan pakai uangmu sendiri dulu, ya. Kalau uangnya kurang, kasih tahu saya.",
    tip: "她的薪水多半要寄回家。讓她先墊，等於讓她把自己的錢借給你。",
  },
  {
    n: 7,
    when: "補錢的時候",
    zh: "我補了兩千元。我們一起看一下，現在一共剩多少。",
    id: "Saya tambah NT$2.000. Ayo kita lihat sama-sama, sekarang sisanya berapa.",
    tip: "補錢時一起看一次餘額，兩個人心裡的數字就會一樣。",
  },
  {
    n: 8,
    when: "約每週對帳",
    zh: "每個星期天晚上，我們花五分鐘一起看這個星期的帳，好嗎？",
    id: "Setiap Minggu malam, kita lihat catatan minggu ini sama-sama sebentar, sekitar lima menit. Boleh?",
    tip: "固定時間、固定很短，對帳就不會變成一種壓力。最後用「好嗎？」問她，而不是直接規定。",
  },
  {
    n: 9,
    when: "有一筆看不懂的時候",
    zh: "這一筆我看不太懂，可以跟我說是買什麼嗎？我只是想了解。",
    id: "Yang ini saya kurang paham. Boleh dijelaskan ini beli apa? Saya cuma ingin tahu saja, ya.",
    tip: "先說「是我看不懂」，而不是「你是不是買錯了」。大部分的疑問，問清楚就沒事了。",
  },
  {
    n: 10,
    when: "誤會了、是自己算錯的時候",
    zh: "對不起，是我算錯了。謝謝你記得這麼清楚。",
    id: "Maaf, saya yang salah hitung. Terima kasih sudah mencatat dengan rapi.",
    tip: "雇主也會算錯。誤會了就大方道歉、謝謝她，下一次她會更願意把帳記清楚。",
  },
];

const TONE = [
  ["用「我們」，少用「你」", "「我們一起看一下」比「你給我看」柔和很多。對帳是兩個人一起確認，不是檢查她。"],
  ["加上 tolong 和 ya", "印尼文的「tolong」是「請」，句尾的「ya」讓語氣變軟，像中文的「喔」「好嗎」。"],
  ["先說明為什麼", "「記下來我們兩個都清楚」比只說「要拿收據」更容易被接受。"],
  ["不要在別人面前談", "對帳、問一筆支出，找兩個人安靜的時間，不要在親戚或長輩面前。"],
  ["說不清楚就用寫的", "語言卡住時，用翻譯 App 或把句子寫下來給她看，比大聲重複更有效。"],
];

const FAQ = [
  {
    q: "看護的中文不太好，談錢會不會講不清楚？",
    a: "可以先用這 10 句當開頭，搭配翻譯 App。更好的方法是把錢記在雙方都看得懂的地方，例如她用印尼文、你用中文看同一本帳，就不用每一筆都靠口頭說明。",
  },
  {
    q: "印尼文的句子可以直接用嗎？",
    a: "可以當作日常溝通的起點。文中的印尼文以簡單、禮貌的說法為主，如果她聽不懂，請她用自己的話再說一次，或請仲介的翻譯協助確認。",
  },
  {
    q: "帳對不上，可以從薪水扣嗎？",
    a: "不要自行從薪水扣錢。薪水依勞動契約與勞動部規定給付，家用金另外記帳。帳對不上時，先一起看收據和紀錄找原因；有疑問請問仲介或撥 1955 專線。",
  },
  {
    q: "她一直不好意思開口說錢不夠，怎麼辦？",
    a: "與其等她開口，不如事先約定一條「該補錢的線」，例如剩下某個金額就補，不用她來要。用 CareCash 的話，可以設定餘額低於某個金額時，手機推播提醒你。",
  },
  {
    q: "看護不是印尼人怎麼辦？",
    a: "這 10 句的意思和語氣同樣適用，可以用翻譯 App 換成越南文、菲律賓文或泰文。CareCash 也支援這些語言，她可以用自己的母語記帳。",
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
            家用金不是大錢，卻是雇主和看護之間最容易尷尬的話題。想請她拿收據，怕她覺得被懷疑；錢快用完了，她不好意思開口；帳對不上，雙方都不知道怎麼問。再加上語言不通，很多話就乾脆不說，誤會也就越積越多。
          </P>
          <P>
            這篇整理<strong>10 句跟錢有關的常用句</strong>，中文和印尼文對照，從給錢、拿收據、補錢、對帳，到誤會時怎麼道歉。每一句都附上語氣提醒：同樣的意思，換個說法，對方的感受就完全不同。
          </P>

          <H2 id="phrases">10 句中印對照常用句</H2>
          <P>金額只是範例，請換成你家的實際數字。NT$3.000 是印尼文寫法，等於中文的三千元。</P>
          <div className="mt-4 space-y-4">
            {PHRASES.map((p) => (
              <div key={p.n} className="card">
                <p className="text-sm font-bold text-muted">{p.n}. {p.when}</p>
                <p className="mt-2 text-xl font-extrabold leading-8">{p.zh}</p>
                <p lang="id" className="mt-2 text-lg leading-8 text-accent-ink">{p.id}</p>
                <p className="mt-3 text-[17px] leading-7 text-muted"><span className="font-bold">語氣提醒：</span>{p.tip}</p>
              </div>
            ))}
          </div>

          <H2 id="tone">五個讓談錢不尷尬的小原則</H2>
          <div className="mt-4 space-y-3">
            {TONE.map(([name, desc]) => (
              <div key={name} className="card">
                <p className="text-lg font-bold">{name}</p>
                <p className="mt-2 text-[17px] leading-7 text-muted">{desc}</p>
              </div>
            ))}
          </div>

          <H2 id="why">為什麼要把話說在前面</H2>
          <P>
            大部分的家用金爭議，不是因為有人拿錢，而是因為<strong>一開始沒有說好</strong>：多少錢、怎麼記、什麼時候補、帳對不上怎麼辦。第一週就把這些用簡單的句子說清楚，之後談錢就只是例行公事。
          </P>
          <P>
            另外，說過的話最好也留下紀錄。口頭說「我給你三千」，一週後兩個人記得的數字可能不一樣；如果每次給錢、補錢都有雙方確認，每筆支出都有收據照片，就不需要靠記憶。家用金怎麼給、怎麼記的完整做法，可以看{" "}
            <Link href="/guide/household-cash-for-caregivers" className="font-bold text-accent-ink underline underline-offset-4">第一次請外籍看護：家用金怎麼給、怎麼記帳</Link>。
          </P>

          <H2 id="for-her">也可以讓她看她的語言版本</H2>
          <P>
            如果看護是印尼人，可以把我們寫給看護看的印尼文說明傳給她：{" "}
            <Link href="/id/panduan/uang-belanja" className="font-bold text-accent-ink underline underline-offset-4">Panduan uang belanja</Link>
            。她先知道家用金怎麼記、為什麼要拿收據，你們談起來會順很多。
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
            還沒決定家用金怎麼給？請看{" "}
            <Link href="/guide/how-employers-give-grocery-money" className="font-bold text-accent-ink underline underline-offset-4">家庭移工買菜怎麼給錢？6 種常見方式比較</Link>。
          </P>

          <div className="card mt-12 p-6 text-center">
            <p className="text-2xl font-extrabold">這些句子，App 裡都有</p>
            <p className="mt-3 text-lg text-muted">
              交家用金時，在 CareCash 家用金點一句，就會用她的語言（印尼文、越南文、菲律賓文、泰文）放大顯示，手機轉過去給她看就好。她也能把「錢快用完了」「我先墊了」用中文顯示給你看。給錢雙方確認、收據拍照、餘額自動算好。
            </p>
            <div className="mx-auto mt-5 max-w-xs">
              <Link href="/sign-in?mode=signup&ref=guide-phrases" className="btn-primary">免費開始使用</Link>
            </div>
            <Link href="/sign-in#demo" className="mt-3 inline-block text-base font-semibold text-accent-ink underline underline-offset-4">先不註冊，試用範例家庭</Link>
          </div>

          <ShareArticle url={`${SITE_URL}/guide/${A.slug}?ref=share`} title={A.title} />

          <RelatedArticles current={A.slug} />

          <p className="mt-10 text-sm text-muted">
            本文為一般性的生活建議，不構成法律意見；文中印尼文為日常溝通參考，正式約定請以書面契約為準。薪資、伙食與工作內容的約定，請以勞動契約、勞動部規定及您的仲介說明為準，不確定時可撥 1955 專線詢問。
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

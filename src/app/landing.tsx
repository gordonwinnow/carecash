import Link from "next/link";
import { BellRing, Camera, Handshake, History, Languages, ReceiptText, ScanBarcode, Users, Wallet } from "lucide-react";
import { PurseIcon } from "@/components/logo";

/** Shared pieces of the public pages (/ and /partners): written in Traditional Chinese for Taiwanese families. */
export function SiteHeader() {
  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
      <Link href="/" className="flex items-center gap-2 font-extrabold">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white"><PurseIcon size={20} /></span>
        <span className="text-lg">看護家用金 <span className="font-semibold text-muted">CareCash</span></span>
      </Link>
      <Link href="/sign-in" className="rounded-full bg-card px-4 py-2 text-sm font-bold [box-shadow:var(--shadow)]">登入</Link>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-5xl px-4 pb-10 pt-6 text-sm text-muted">
      <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-6">
        <span>© {new Date().getFullYear()} CareCash 看護家用金</span>
        <Link href="/partners" className="underline-offset-4 hover:underline">仲介公司合作</Link>
        <Link href="/privacy" className="underline-offset-4 hover:underline">隱私權政策</Link>
      </div>
    </footer>
  );
}

const PAINS = [
  "每週拿一疊收據對帳，對不起來又不好意思問",
  "菜錢給了多少、還剩多少，兄弟姊妹各說各話",
  "看護說錢不夠用，卻不知道花到哪裡去",
  "語言不通，想問清楚又怕傷了和氣",
];

const STEPS = [
  { t: "建立家庭", d: "用 Email、Google 或 LINE 註冊，30 秒完成。" },
  { t: "邀請看護", d: "用 LINE 或 WhatsApp 傳邀請連結，看護用自己的語言使用。" },
  { t: "看護記帳，你隨時看", d: "看護拍收據、輸入金額；你在手機上看到每一筆支出和剩下的家用金。" },
];

const FEATURES = [
  { icon: Handshake, t: "交錢收錢，雙方確認", d: "你給錢，看護按「已收到」；看護說收到錢，你按「確認」。不再有「我明明給了」的爭議。" },
  { icon: Camera, t: "收據拍照保存", d: "每筆支出都附收據照片，按月份整理，隨時回頭查。" },
  { icon: Wallet, t: "餘額一眼看清", d: "上月剩餘＋本月給的－本月花的，自動算好，雙方看到同一個數字。" },
  { icon: BellRing, t: "家用金快用完提醒", d: "餘額低於你設定的金額時，手機推播通知你。" },
  { icon: Users, t: "兄弟姊妹一起管", d: "邀請家人一起看帳、一起出家用金，費用分攤清清楚楚。" },
  { icon: ScanBarcode, t: "發票載具條碼", d: "看護結帳時出示家裡的手機條碼，發票自動歸戶，中獎不漏接。" },
  { icon: ReceiptText, t: "薪資與健檢紀錄", d: "薪水、健檢等費用集中記錄，可選擇是否讓看護看到。" },
  { icon: History, t: "每次修改都有紀錄", d: "新增、修改、刪除都留下歷史，誰改了什麼一清二楚。" },
];

const FAQ = [
  { q: "要收費嗎？", a: "目前完全免費。" },
  { q: "需要下載 App 嗎？", a: "不用。手機瀏覽器打開就能用，也可以「加到主畫面」，像 App 一樣一鍵開啟。" },
  { q: "看護不會中文怎麼辦？", a: "每個人可以選自己的語言：印尼文、越南文、菲律賓文、泰文、英文等 10 種語言。你看中文，她看她的母語，記的是同一本帳。" },
  { q: "家裡的帳誰看得到？", a: "只有你邀請的家人和看護。薪資與健康紀錄預設只有雇主看得到。" },
  { q: "家裡有兩位看護可以嗎？", a: "可以。每位看護各自有自己的家用金餘額。" },
  { q: "可以先試用看看嗎？", a: "可以。登入頁有「以雇主試用」和「以看護試用」，不用註冊就能看到範例資料。" },
];

export function Landing() {
  return (
    <div className="min-h-dvh bg-bg">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-4 pb-12 pt-6 text-center sm:pt-12">
          <p className="mx-auto mb-4 inline-block rounded-full bg-accent-soft px-4 py-1.5 text-sm font-bold text-accent-ink">給聘請外籍看護的家庭</p>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            看護的家用金
            <br />
            每一筆都清楚
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted sm:text-xl">
            看護拍收據記帳、交錢雙方確認，你隨時在手機上看到餘額。不用每週對帳，也不會因為菜錢傷感情。
          </p>
          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <Link href="/sign-in" className="btn-primary">免費開始使用</Link>
            <Link href="/sign-in#demo" className="btn-soft">免註冊，先試用</Link>
          </div>
          <p className="mt-5 text-sm text-muted">免費・免下載・支援 Bahasa Indonesia、Tiếng Việt、Tagalog、ภาษาไทย 等 10 種語言</p>
        </section>

        {/* Pain points */}
        <section className="mx-auto max-w-5xl px-4 py-10">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">這些情況，你熟悉嗎？</h2>
          <ul className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-2">
            {PAINS.map((p) => (
              <li key={p} className="card text-lg">「{p}」</li>
            ))}
          </ul>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-muted">
            家用金不是大錢，卻是雇主和看護之間最容易起摩擦的地方。帳清楚了，彼此才放心。
          </p>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-5xl px-4 py-10">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">三步驟開始</h2>
          <ol className="mt-6 grid gap-3 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.t} className="card">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-lg font-extrabold text-white">{i + 1}</span>
                <h3 className="mt-3 text-xl font-bold">{s.t}</h3>
                <p className="mt-1 text-muted">{s.d}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-5xl px-4 py-10">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">家用金需要的，都在這裡</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, t, d }) => (
              <div key={t} className="card">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent-ink"><Icon size={22} /></span>
                <h3 className="mt-3 text-lg font-bold">{t}</h3>
                <p className="mt-1 text-[15px] text-muted">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Fair to the caretaker too */}
        <section className="mx-auto max-w-5xl px-4 py-10">
          <div className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:p-8">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent-ink"><Languages size={28} /></span>
            <div>
              <h2 className="text-2xl font-extrabold">對看護也公平</h2>
              <p className="mt-2 text-lg text-muted">
                看護用自己的語言操作，每一筆收到的錢都有雙方確認、每一筆支出都有收據。清楚的帳，保護你，也保護她。
              </p>
              <p className="mt-3 text-sm font-semibold text-muted">繁體中文・Bahasa Indonesia・Tiếng Việt・Tagalog・ภาษาไทย・English・日本語・한국어・Español・Français</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-4 py-10">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">常見問題</h2>
          <div className="mt-6 space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="card group">
                <summary className="cursor-pointer list-none text-lg font-bold">
                  {f.q}
                </summary>
                <p className="mt-2 text-muted">{f.a}</p>
              </details>
            ))}
            <div className="card">
              <p className="text-lg font-bold">我是仲介公司，可以推薦給雇主嗎？</p>
              <p className="mt-2 text-muted">
                歡迎！請看 <Link href="/partners" className="font-bold text-accent-ink underline underline-offset-4">仲介公司合作</Link>。
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-5xl px-4 py-12 text-center">
          <h2 className="text-3xl font-extrabold">今天就讓家用金清清楚楚</h2>
          <p className="mt-3 text-lg text-muted">免費使用，邀請看護只要傳一個連結。</p>
          <div className="mx-auto mt-6 max-w-sm">
            <Link href="/sign-in" className="btn-primary">免費開始使用</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        // FAQ rich results in Google search
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }),
        }}
      />
    </div>
  );
}

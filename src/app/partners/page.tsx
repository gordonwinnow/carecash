import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, HeartHandshake, Languages, PhoneOff, ShieldCheck, Sparkles } from "lucide-react";
import { SiteFooter, SiteHeader } from "../landing";

export const metadata: Metadata = {
  title: "仲介公司合作｜CareCash 家用金",
  description: "免費提供給您的雇主客戶：家用金雙方確認、收據留存、多語介面，減少家用金糾紛與處理時間。",
  alternates: { canonical: "/partners" },
};

const WHY = [
  { icon: PhoneOff, t: "少接一些糾紛電話", d: "家用金、菜錢對不清楚，是雇主與看護常見的摩擦。每筆錢都有收據、交錢雙方確認，爭議在發生前就說清楚。" },
  { icon: HeartHandshake, t: "雇主更安心，看護被公平對待", d: "雇主隨時看得到餘額；看護用母語操作、收到的錢有紀錄。雙方信任，有助於穩定聘僱關係。" },
  { icon: Sparkles, t: "零成本的加值服務", d: "目前完全免費。您可以把它當成貴公司提供給雇主客戶的貼心工具。" },
  { icon: Languages, t: "看護看得懂", d: "印尼文、越南文、菲律賓文、泰文等 10 種語言，每個人選自己的語言。" },
  { icon: BarChart3, t: "專屬推薦連結與成效報告", d: "每家合作仲介有自己的連結與 QR code，我們每月回報有多少家庭透過您開始使用。" },
  { icon: ShieldCheck, t: "隱私有保障", d: "只有雇主邀請的家人和看護看得到該家的帳，薪資與健康紀錄預設僅雇主可見。" },
];

const HOW = [
  { t: "15 分鐘線上介紹", d: "我們示範雇主與看護兩邊的畫面，並回答您的問題。" },
  { t: "拿到專屬連結與說明單張", d: "中文給雇主、印尼文／越南文給看護，可印出或用 LINE 傳送。" },
  { t: "在新案媒合或訪視時推薦", d: "建議在看護入境、到雇主家的第一週就開始使用，習慣最好養成。" },
  { t: "每月成效報告", d: "看到有多少家庭開始使用，以及您的雇主客戶的回饋。" },
];

export default function Partners() {
  // Public contact for brokers; the CONTACT_EMAIL secret overrides it
  const email = process.env.CONTACT_EMAIL || "gosomini@googlegroups.com";
  const line = process.env.CONTACT_LINE_URL;
  return (
    <div className="min-h-dvh bg-bg">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-5xl px-4 pb-10 pt-6 text-center sm:pt-12">
          <p className="mx-auto mb-4 inline-block rounded-full bg-accent-soft px-4 py-1.5 text-sm font-bold text-accent-ink">給人力仲介公司</p>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">讓雇主和看護之間<br />少一件需要調解的事</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted sm:text-xl">
            CareCash 家用金 讓每筆家用金都有收據、交錢收錢雙方確認。免費提供給您的雇主客戶，減少您處理家用金糾紛的時間。
          </p>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-8">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {WHY.map(({ icon: Icon, t, d }) => (
              <div key={t} className="card">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent-ink"><Icon size={22} /></span>
                <h2 className="mt-3 text-lg font-bold">{t}</h2>
                <p className="mt-1 text-[15px] text-muted">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-8">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">合作方式</h2>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {HOW.map((s, i) => (
              <li key={s.t} className="card">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-lg font-extrabold text-white">{i + 1}</span>
                <h3 className="mt-3 text-lg font-bold">{s.t}</h3>
                <p className="mt-1 text-[15px] text-muted">{s.d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-12 text-center">
          <h2 className="text-3xl font-extrabold">預約 15 分鐘介紹</h2>
          <p className="mt-3 text-lg text-muted">或先自己試用：登入頁點「以雇主試用」或「以看護試用」，不用註冊。</p>
          <div className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
            {line && <a href={line} className="btn text-white" style={{ background: "#06C755" }}>LINE 聯絡我們</a>}
            {email && <a href={`mailto:${email}?subject=${encodeURIComponent("仲介合作：CareCash 家用金")}`} className="btn-primary">Email 聯絡我們</a>}
            <Link href="/sign-in#demo" className="btn-soft">先試用看看</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

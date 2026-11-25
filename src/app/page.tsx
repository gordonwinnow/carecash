import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCtx } from "@/lib/ctx";
import { Landing } from "./landing";

export const metadata: Metadata = {
  title: "看護家用金 CareCash｜外籍看護菜錢、家用金記帳 App（免費）",
  description:
    "給聘請外籍看護的家庭：看護拍收據記帳、交錢雙方確認，雇主隨時看到家用金餘額。支援印尼文、越南文、菲律賓文、泰文等 10 種語言，免費、免下載。",
  alternates: { canonical: "/" },
  openGraph: {
    title: "看護家用金 CareCash｜每一筆菜錢都清楚",
    description: "看護拍收據記帳、交錢雙方確認，雇主隨時看到餘額。免費，支援 10 種語言。",
    type: "website",
    locale: "zh_TW",
    siteName: "看護家用金 CareCash",
    images: [{ url: "/icon-1024.png", width: 1024, height: 1024 }],
  },
};

/** Signed-in people go straight to the app; everyone else sees the public landing page. */
export default async function Root() {
  const { user, me } = await getCtx();
  if (user) redirect(me ? "/home" : "/start");
  return <Landing />;
}

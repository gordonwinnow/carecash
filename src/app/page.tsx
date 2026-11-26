import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCtx, getLang } from "@/lib/ctx";
import { Landing } from "./landing";
import { LANDING } from "./landing-copy";

/** Title and description in the visitor's language; search engines (no language cookie) get Traditional Chinese. */
export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const m = (LANDING[lang] ?? LANDING["zh-TW"]).meta;
  return {
    title: m.title,
    description: m.description,
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
}

/** Signed-in people go straight to the app; everyone else sees the public landing page, in their language. */
export default async function Root() {
  const { user, me } = await getCtx();
  if (user) redirect(me ? "/home" : "/start");
  return <Landing lang={await getLang()} />;
}

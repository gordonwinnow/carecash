import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCtx, getLang } from "@/lib/ctx";
import { isNativeApp } from "@/lib/native";
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
      title: "CareCash 家用金｜看護、幫傭的家用金，每一筆都清楚",
      description: "看護拍收據記帳、交錢雙方確認，雇主隨時看到餘額。免費，支援 10 種語言。",
      type: "website",
      locale: "zh_TW",
      siteName: "CareCash 家用金",
      images: [{ url: "/icon-1024.png", width: 1024, height: 1024 }],
    },
  };
}

/**
 * Everyone sees the public site, in their language; signed-in visitors get "open the app" instead of "sign in".
 * Only the iPhone app, which opens on "/", goes straight into the app.
 */
export default async function Root() {
  const { user, me } = await getCtx();
  const app = me ? "/home" : "/start";
  if (user && isNativeApp((await headers()).get("user-agent") ?? "")) redirect(app);
  return <Landing lang={await getLang()} appHref={user ? app : undefined} />;
}

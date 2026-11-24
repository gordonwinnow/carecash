import "./globals.css";
import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { I18nProvider } from "@/components/i18n";
import { getLang } from "@/lib/ctx";
import { ACCENTS, THEMES } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "CareCash",
  description: "Track grocery cash and expenses between a family and its caretaker",
  appleWebApp: { capable: true, title: "CareCash", statusBarStyle: "default" },
  icons: { icon: "/icon-512.png", apple: "/apple-icon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#15803d",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const c = await cookies();
  const lang = await getLang();
  const theme = THEMES.find((x) => x === c.get("theme")?.value) ?? "system";
  const accent = ACCENTS.find((x) => x === c.get("accent")?.value) ?? "green";
  return (
    <html lang={lang} data-theme={theme} data-accent={accent}>
      <body className="min-h-dvh">
        <I18nProvider lang={lang}>{children}</I18nProvider>
      </body>
    </html>
  );
}

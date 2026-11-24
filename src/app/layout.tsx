import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { cookies } from "next/headers";
import { I18nProvider } from "@/components/i18n";
import { getLang } from "@/lib/ctx";
import { ACCENTS, THEMES } from "@/lib/i18n";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin", "latin-ext", "vietnamese"], variable: "--font-jakarta", display: "swap" });

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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f3ef" },
    { media: "(prefers-color-scheme: dark)", color: "#111110" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const c = await cookies();
  const lang = await getLang();
  const theme = THEMES.find((x) => x === c.get("theme")?.value) ?? "system";
  const accent = ACCENTS.find((x) => x === c.get("accent")?.value) ?? "green";
  return (
    <html lang={lang} data-theme={theme} data-accent={accent} className={jakarta.variable}>
      <body className="min-h-dvh font-sans">
        <I18nProvider lang={lang}>{children}</I18nProvider>
      </body>
    </html>
  );
}

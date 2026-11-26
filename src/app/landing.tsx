import Link from "next/link";
import { BellRing, Camera, Handshake, History, Languages, ReceiptText, ScanBarcode, Users, Wallet } from "lucide-react";
import { PurseIcon } from "@/components/logo";
import { LanguagePicker } from "@/components/settings";
import type { Lang } from "@/lib/i18n";
import { LANDING, type LandingCopy } from "./landing-copy";

/**
 * Shared pieces of the public pages. The homepage (/) is in the visitor's language (the app's 10, picked like in the app);
 * /guide and /partners are written for Taiwanese families and brokers, so they stay in Traditional Chinese.
 */
export function SiteHeader({ copy = LANDING["zh-TW"], picker = false }: { copy?: LandingCopy; picker?: boolean }) {
  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4">
      <Link href="/" className="flex shrink-0 items-center gap-2 font-extrabold">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-white"><PurseIcon size={20} /></span>
        <span className="whitespace-nowrap text-lg">
          CareCash <span className="font-semibold text-muted">家用金</span>
        </span>
      </Link>
      <nav className="flex min-w-0 items-center gap-2 sm:gap-3">
        {picker && (
          <div className="min-w-0 [&_select]:w-full [&_select]:max-w-36 [&_select]:px-3 [&_select]:py-1.5 [&_select]:text-sm">
            <LanguagePicker compact />
          </div>
        )}
        <Link href="/guide" className="hidden text-sm font-bold text-muted hover:text-ink sm:inline">{copy.nav.guide}</Link>
        <Link href="/sign-in" className="whitespace-nowrap rounded-full bg-card px-4 py-2 text-sm font-bold [box-shadow:var(--shadow)]">{copy.nav.signIn}</Link>
      </nav>
    </header>
  );
}

export function SiteFooter({ copy = LANDING["zh-TW"] }: { copy?: LandingCopy }) {
  return (
    <footer className="mx-auto max-w-5xl px-4 pb-10 pt-6 text-sm text-muted">
      <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-6">
        <span>© {new Date().getFullYear()} CareCash 家用金</span>
        <Link href="/guide" className="underline-offset-4 hover:underline">{copy.nav.guideFooter}</Link>
        <Link href="/partners" className="underline-offset-4 hover:underline">{copy.nav.partners}</Link>
        <Link href="/privacy" className="underline-offset-4 hover:underline">{copy.nav.privacy}</Link>
        <a href="https://www.instagram.com/carecash.me/" className="underline-offset-4 hover:underline" rel="noopener" target="_blank">Instagram</a>
      </div>
    </footer>
  );
}

const FEATURE_ICONS = [Handshake, Camera, Wallet, BellRing, Users, ScanBarcode, ReceiptText, History];

export function Landing({ lang }: { lang: Lang }) {
  const c = LANDING[lang] ?? LANDING["zh-TW"];
  return (
    <div className="min-h-dvh bg-bg">
      <SiteHeader copy={c} picker />
      <main>
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-4 pb-12 pt-6 text-center sm:pt-12">
          <p className="mx-auto mb-4 inline-block rounded-full bg-accent-soft px-4 py-1.5 text-sm font-bold text-accent-ink">{c.hero.badge}</p>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            {c.hero.title1}
            <br />
            {c.hero.title2}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted sm:text-xl">{c.hero.sub}</p>
          <div className="mx-auto mt-8 max-w-xs">
            <Link href="/sign-in" className="btn-primary">{c.hero.cta}</Link>
          </div>
          <p className="mt-5 text-sm text-muted">{c.hero.note}</p>
        </section>

        {/* Pain points */}
        <section className="mx-auto max-w-5xl px-4 py-10">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">{c.pains.title}</h2>
          <ul className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-2">
            {c.pains.items.map((p) => (
              <li key={p} className="card text-lg">「{p}」</li>
            ))}
          </ul>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-muted">{c.pains.note}</p>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-5xl px-4 py-10">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">{c.steps.title}</h2>
          <ol className="mt-6 grid gap-3 sm:grid-cols-3">
            {c.steps.items.map((s, i) => (
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
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">{c.features.title}</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {c.features.items.map(({ t, d }, i) => {
              const Icon = FEATURE_ICONS[i] ?? Handshake;
              return (
                <div key={t} className="card">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent-ink"><Icon size={22} /></span>
                  <h3 className="mt-3 text-lg font-bold">{t}</h3>
                  <p className="mt-1 text-[15px] text-muted">{d}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Fair to the caretaker too */}
        <section className="mx-auto max-w-5xl px-4 py-10">
          <div className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:p-8">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent-ink"><Languages size={28} /></span>
            <div>
              <h2 className="text-2xl font-extrabold">{c.fair.title}</h2>
              <p className="mt-2 text-lg text-muted">{c.fair.body}</p>
              <p className="mt-3 text-sm font-semibold text-muted">繁體中文・Bahasa Indonesia・Tiếng Việt・Tagalog・ภาษาไทย・English・日本語・한국어・Español・Français</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-4 py-10">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">{c.faq.title}</h2>
          <div className="mt-6 space-y-3">
            {c.faq.items.map((f) => (
              <details key={f.q} className="card group">
                <summary className="cursor-pointer list-none text-lg font-bold">{f.q}</summary>
                <p className="mt-2 text-muted">{f.a}</p>
              </details>
            ))}
            <div className="card">
              <p className="text-lg font-bold">{c.faq.brokerQ}</p>
              <p className="mt-2 text-muted">
                {c.faq.brokerA} <Link href="/partners" className="font-bold text-accent-ink underline underline-offset-4">{c.faq.brokerLink}</Link>
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-5xl px-4 py-12 text-center">
          <h2 className="text-3xl font-extrabold">{c.final.title}</h2>
          <p className="mt-3 text-lg text-muted">{c.final.sub}</p>
          <div className="mx-auto mt-6 max-w-sm">
            <Link href="/sign-in" className="btn-primary">{c.hero.cta}</Link>
          </div>
        </section>
      </main>
      <SiteFooter copy={c} />
      <script
        type="application/ld+json"
        // FAQ rich results in Google search
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            inLanguage: lang,
            mainEntity: c.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }),
        }}
      />
    </div>
  );
}

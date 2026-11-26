import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../landing";
import { ARTICLES } from "./articles";

export const metadata: Metadata = {
  title: "家用金指南｜外籍看護雇主的實用文章",
  description: "給聘請外籍看護家庭的實用指南：家用金、記帳、收據、與看護溝通。",
  alternates: { canonical: "/guide" },
};

export default function Guide() {
  return (
    <div className="min-h-dvh bg-bg">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pb-12 pt-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">家用金指南</h1>
        <p className="mt-3 text-lg text-muted">給聘請外籍看護家庭的實用文章。</p>
        <ul className="mt-8 space-y-3">
          {ARTICLES.map((a) => (
            <li key={a.slug}>
              <Link href={`/guide/${a.slug}`} className="card block hover:[box-shadow:var(--shadow)]">
                <h2 className="text-xl font-bold">{a.title}</h2>
                <p className="mt-2 text-muted">{a.description}</p>
                <p className="mt-2 text-sm text-muted">{a.published}</p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </div>
  );
}

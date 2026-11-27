import Link from "next/link";
import { ARTICLES } from "./articles";

/** The end of each article: the other guide articles (newest first), so a reader from search or Threads keeps reading. */
export function RelatedArticles({ current }: { current: string }) {
  const others = ARTICLES.filter((a) => a.slug !== current).slice(0, 3);
  if (others.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="text-xl font-extrabold">延伸閱讀</h2>
      <ul className="mt-4 space-y-3">
        {others.map((a) => (
          <li key={a.slug}>
            <Link href={`/guide/${a.slug}`} className="card block hover:[box-shadow:var(--shadow)]">
              <p className="text-lg font-bold">{a.title}</p>
              <p className="mt-1 line-clamp-2 text-[15px] text-muted">{a.description}</p>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/guide" className="mt-4 inline-block font-bold text-accent-ink underline underline-offset-4">看全部家用金指南 →</Link>
    </section>
  );
}

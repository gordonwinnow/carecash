/** The articles under /guide, newest first. Used by the guide index, the sitemap and each article's metadata. */
export type Article = { slug: string; title: string; description: string; published: string; updated?: string };

export const ARTICLES: Article[] = [
  {
    slug: "household-cash-for-caregivers",
    title: "第一次請外籍看護：家用金怎麼給、怎麼記帳",
    description:
      "第一次請外籍看護的家庭必看：家用金一週給多少、怎麼交接才不會有爭議、收據和發票怎麼留、怎麼對帳，附簡單的記帳方法與常見問題。",
    published: "2026-11-26",
  },
];

export const article = (slug: string) => ARTICLES.find((a) => a.slug === slug);

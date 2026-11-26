/** The articles under /guide, newest first. Used by the guide index, the sitemap and each article's metadata. */
export type Article = { slug: string; title: string; description: string; published: string; updated?: string };

export const ARTICLES: Article[] = [
  {
    slug: "caregiver-food-and-household-cash-per-month",
    title: "外籍看護伙食費、家用金一個月多少？三種錢分清楚",
    description:
      "請外籍看護，伙食費和家用金一個月要準備多少？先分清楚薪水、看護伙食、家用採買三種錢，再用三週記錄估出你家的實際金額，附範例與常見問題。",
    published: "2026-11-26",
  },
  {
    slug: "household-cash-for-caregivers",
    title: "第一次請外籍看護：家用金怎麼給、怎麼記帳",
    description:
      "第一次請外籍看護的家庭必看：家用金一週給多少、怎麼交接才不會有爭議、收據和發票怎麼留、怎麼對帳，附簡單的記帳方法與常見問題。",
    published: "2026-11-26",
  },
];

export const article = (slug: string) => ARTICLES.find((a) => a.slug === slug);

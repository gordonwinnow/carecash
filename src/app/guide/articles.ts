/** The articles under /guide, newest first. Used by the guide index, the sitemap and each article's metadata. */
export type Article = { slug: string; title: string; description: string; published: string; updated?: string };

export const ARTICLES: Article[] = [
  {
    slug: "first-week-with-new-caregiver",
    title: "看護來了！第一週清單：家用金、家規、溝通一次講清楚",
    description:
      "外籍看護第一次到家，第一週怎麼安排？到之前要準備什麼、第 1 到 7 天每天做什麼、家規表怎麼寫、家用金怎麼開始，加上語言工具、隱私與休假，一份清單講清楚。",
    published: "2026-11-27",
  },
  {
    slug: "caregiver-food-and-halal",
    title: "印尼看護的飲食：清真、三餐安排與伙食費",
    description:
      "印尼看護不吃豬肉，三餐怎麼辦？整理清真飲食的基本原則、三種常見的煮飯安排、齋戒月要注意什麼，以及伙食費怎麼跟家用金分開給、分開記。",
    published: "2026-11-27",
  },
  {
    slug: "caregiver-pays-first-reimbursement",
    title: "看護先墊錢怎麼辦？先墊後報的公平做法",
    description:
      "看護自己先墊錢買菜、買藥，對她其實有風險。說明為什麼不該當常態、真的要墊時的上限與當天還款原則、每週對帳，以及帳上餘額變成負數時該怎麼處理。",
    published: "2026-11-27",
  },
  {
    slug: "how-employers-give-grocery-money",
    title: "家庭移工買菜怎麼給錢？6 種常見方式比較",
    description:
      "請家庭看護，買菜和日用品的錢怎麼給？比較固定週轉金、每次給整數找零、先墊後報、雇主網購、固定伙食費、店家記帳或儲值卡 6 種方式的做法、適合誰、風險與記帳方法，附怎麼選。",
    published: "2026-11-27",
  },
  {
    slug: "lunar-new-year-caregiver-holiday-money",
    title: "過年請外籍看護：放假、紅包、加班費與家用金怎麼安排",
    description:
      "2027 年除夕是 2 月 5 日。家裡有外籍看護，過年要不要放假、國定假日出勤怎麼處理、紅包怎麼包、年前家用金要多準備多少？附替代照顧與常見問題。",
    published: "2026-11-27",
  },
  {
    slug: "siblings-sharing-parent-care-costs",
    title: "兄弟姊妹分攤爸媽的看護費、家用金：怎麼算才不吵架",
    description:
      "爸媽請了外籍看護，兄弟姊妹怎麼分攤薪水、規費、伙食和家用金？比較平均分、依收入比例、出錢出力折算三種方法，附範例、共用帳本與每月對帳做法。",
    published: "2026-11-27",
  },
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

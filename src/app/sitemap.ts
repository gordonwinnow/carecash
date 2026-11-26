import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { ARTICLES } from "./guide/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/id`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/guide`, changeFrequency: "weekly", priority: 0.8 },
    ...ARTICLES.map((a) => ({ url: `${SITE_URL}/guide/${a.slug}`, lastModified: a.updated ?? a.published, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${SITE_URL}/partners`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];
}

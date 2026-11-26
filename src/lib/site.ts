/** The public address, for absolute links in metadata, the sitemap and social previews. */
export const SITE_URL = (process.env.SITE_URL || process.env.BETTER_AUTH_URL || "https://carecash.fly.dev").replace(/\/$/, "");

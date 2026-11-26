/** The public address, for absolute links in metadata, the sitemap and social previews. Defaults to carecash.me (also at build time, when secrets are not set). */
export const SITE_URL = (process.env.SITE_URL || "https://carecash.me").replace(/\/$/, "");

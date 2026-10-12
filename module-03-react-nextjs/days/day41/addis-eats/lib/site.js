// The site's public address. metadataBase, the sitemap, robots.txt and JSON-LD all need absolute
// URLs, and they all build them from here. Set SITE_URL to the production URL (see .env.example).
//   1. SITE_URL, if set
//   2. Vercel's production domain, when deployed there
//   3. http://localhost:3000 for local development
export const SITE_URL = (
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  "http://localhost:3000"
).replace(/\/$/, "");

export const SITE_NAME = "Addis Eats";

// For personal or staff-only pages: keep them out of search results.
export const NO_INDEX = { index: false, follow: false };

export function absoluteUrl(path) {
  return new URL(path, `${SITE_URL}/`).toString();
}

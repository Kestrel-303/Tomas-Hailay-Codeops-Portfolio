// The site's public address, used for metadataBase, canonical URLs, og:image tags, the sitemap
// and JSON-LD, all of which must be absolute. It's read at BUILD time (the sitemap and the cards
// are prerendered), so a change needs a new build. Not secret; read on the server only.
//   1. SITE_URL, if set (a custom domain: set it for Production only)
//   2. On Vercel, the deployment's own address: the production domain for a Production build,
//      the preview's unique URL for a Preview build, so a preview's link cards point at the
//      preview and not at production
//   3. http://localhost:3000 for local development
const vercelHost =
  process.env.VERCEL_ENV === 'production' ? process.env.VERCEL_PROJECT_PRODUCTION_URL : process.env.VERCEL_URL;

export const SITE_URL = (process.env.SITE_URL || (vercelHost && `https://${vercelHost}`) || 'http://localhost:3000').replace(/\/$/, '');

export const SITE_NAME = 'Addis Eats';

// For pages that are personal (cart, checkout, orders) or staff-only: keep them out of search
// results. They are also left out of the sitemap, and the private ones are disallowed in robots.txt.
export const NO_INDEX = { index: false, follow: false };

export function absoluteUrl(path) {
  return new URL(path, `${SITE_URL}/`).toString();
}

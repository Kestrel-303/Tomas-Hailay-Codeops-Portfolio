// The site's public address. metadataBase, link-preview cards, canonical URLs, JSON-LD and the
// sitemap need absolute URLs, and they're prerendered, so this is read at BUILD time.
//   1. SITE_URL, if set (a custom domain: set it for Production only)
//   2. On Vercel, the build's own address: the production domain for a Production build, the
//      preview's unique URL for a Preview build (so a preview's cards don't point at production)
//   3. http://localhost:3000 locally
const vercelHost =
  process.env.VERCEL_ENV === 'production' ? process.env.VERCEL_PROJECT_PRODUCTION_URL : process.env.VERCEL_URL;

export const SITE_URL = (process.env.SITE_URL || (vercelHost && `https://${vercelHost}`) || 'http://localhost:3000').replace(/\/$/, '');

export const SITE_NAME = 'Mella Scents';

// Pages that belong to one person (bag, wishlist, checkout, account, orders): kept out of search.
export const NO_INDEX = { index: false, follow: false };

export const absoluteUrl = (path) => new URL(path, `${SITE_URL}/`).toString();

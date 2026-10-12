# Metadata and SEO (Day 41)

Every step was checked by **viewing the source of the running page** (`next build && next start`, with `SITE_URL=https://addis-eats.example` as a stand-in production URL), not by reading the code.

| # | Exercise | Where | What the page source shows |
|---|---|---|---|
| 1 | `metadataBase` and a title template in the root layout, with a default title | `app/layout.js`, URL from `lib/site.js` (`SITE_URL`) | `/menu` → `<title>Full menu · Addis Eats</title>`. Every `og:image` starts with `https://addis-eats.example/`. |
| 2 | Every static route has its own title and a description written for a person | `metadata` exports on `/`, `/home`, `/menu`, `/search`, `/checkout`, `/orders`, `/orders/[id]`, `/kitchen`, `/sign-in`, the dish not-found page; `/cart` uses `app/cart/layout.js` (its page is a client component, which can't export metadata) | 9 of 9 public routes checked, all titles and descriptions different. `/` uses `title.absolute` ("Welcome to Addis Eats"). |
| 3 | `generateMetadata` on the dish route from the name, price and summary | `app/menu/[id]/page.jsx`. Each dish now has a one-line `summary` in `lib/dishes.js`, shown on the page under the name. | `Doro Wot · $12 · Addis Eats`, described as "Chicken slow-simmered in a deep red berbere and onion sauce, served with a hard-boiled egg. $12 at Addis Eats." All 13 dish descriptions differ. |
| 4 | A site-wide `opengraph-image`, then one per dish with `ImageResponse` | `app/opengraph-image.jsx`, `app/menu/[id]/opengraph-image.jsx` | `og:image` 1200×630 everywhere. The site card shows four real dishes and their prices. Each dish card shows its photo, category, summary and price, with its own `og:image:alt` (via `generateImageMetadata`). |
| 5 | MenuItem JSON-LD from the same dish object the page renders | `menuItemJsonLd(dish)` in `app/menu/[id]/page.jsx` | `MenuItem name="Doro Wot" price=12 USD`, against the page's `h1` "Doro Wot" and Price "$12". The JSON-LD `description` is the same text as the summary paragraph. |
| 6 | `app/sitemap.js` from the dishes, without private routes | `app/sitemap.js` | 17 URLs (`/`, `/home`, `/menu`, `/search` and all 13 dishes), all absolute. **0** of `/checkout`, `/orders`, `/kitchen`, `/cart` and `/sign-in`. |
| 7 | `robots.js` disallowing `/cart` and `/checkout`, pointing at the sitemap | `app/robots.js` | `Disallow: /cart` and `Disallow: /checkout` (plus `/orders`, `/kitchen` and `/api/`), and `Sitemap: https://addis-eats.example/sitemap.xml` |

## Notes

- **Currency:** prices are in US dollars in this version of the app, so the JSON-LD says `priceCurrency: "USD"`, to match what the page shows.
- **`SITE_URL`:** documented in `.env.example`. Set it to the real address before deploying, or absolute URLs fall back to Vercel's domain, then localhost.
- **Private pages** (`/checkout`, `/orders`, `/kitchen`) redirect signed-out visitors to sign-in. Their metadata also carries `noindex`.
- **Unknown dish URLs return 200:** `/menu/no-such-dish` returns status **200** with the "Dish not found" page (title and `noindex` are correct), not a 404.
  - This was already the case before today. `app/menu/loading.jsx` makes Next stream the page, so `notFound()` happens after the 200 has been sent.
  - Search engines treat that as a "soft 404". Moving the dish lookup above the loading boundary would fix it.

# Making Addis Eats Findable: SEO.md

Metadata on every route, link previews, structured data, and a sitemap built from the dish records. Everything below was checked in the **page source** of a production build (`next build && next start`) with `SITE_URL=https://addis-eats.example`, a placeholder for the real address.

## Setup

- **`SITE_URL`** (in `.env.example`): the production address. `metadataBase`, canonical links, `og:image` tags, the sitemap and JSON-LD are all built from it.
  - **Set it to the real domain before deploying.** Without it, Vercel's production domain is used, then `http://localhost:3000`.
  - `lib/site.js` is the only place it's read.
- **Root layout:** sets `metadataBase`, a title template `%s · Addis Eats` with a default title, the default description, `openGraph.siteName` and `twitter:card = summary_large_image`.

## Every route

| Route | Title | Description | Canonical | Indexed? |
| --- | --- | --- | --- | --- |
| `/` | Addis Eats · Ethiopian food delivered in Addis Ababa (`title.absolute`) | What, where, how to pay | `/` | yes |
| `/menu` | Menu · Addis Eats | The full menu, priced in ETB | `/menu` | yes |
| `/menu?category=Tibs` | Tibs dishes · Addis Eats | A blurb for that category | `/menu?category=Tibs` | yes |
| `/menu/[id]` | e.g. Special Kitfo · 480 ETB · Addis Eats | Built from the dish record (below) | `/menu/[id]` | yes |
| `/cart` | Your cart · Addis Eats | Review the cart before checkout | `/cart` | noindex (different for every visitor) |
| `/sign-in` | Sign in · Addis Eats | Why to sign in | `/sign-in` | noindex |
| `/checkout`, `/orders`, `/orders/[id]`, `/kitchen` | Checkout, My orders, Order status, Kitchen order board | One each | (none: private) | noindex, and disallowed in robots.txt |
| not found | Page not found · Addis Eats | Where to go instead | (none) | noindex |

The cart page is a client component, which can't export metadata, so its metadata is in `app/cart/layout.js`.

**Dish metadata** comes from `generateMetadata` in `app/menu/[id]/page.js`, entirely from the dish record:
- **Title:** name and price.
- **Description:** the dish's own description in whole sentences, then its price, spice level and "fasting-friendly" where it applies, up to 160 characters. Doro Wat's first sentence is only 35 characters, so the next one is added and trimmed at a word.
- **Open Graph:** the title is the name plus the Amharic name.

All 12 dish descriptions are different, from 102 to 159 characters.

**Canonical URLs** on the routes that take query parameters:
- **`/menu`:** keeps a real `category` and a `page` above 1 that actually exists. Everything else is dropped: `/menu?category=Tibs&page=9&simError=true&utm_source=x` → `https://addis-eats.example/menu?category=Tibs`.
- **`/sign-in`:** drops `?next=`.
- **`/cart`:** drops `?add=`.

## Link previews (1200 × 630)

- **`app/opengraph-image.js`:** the site-wide card, used by every page without its own.
  - It shows the real platter photo from the hero (Wikimedia Commons, CC BY-SA 2.0, credit on the card), the brand, "Ethiopian food, delivered in Addis Ababa", and how to pay.
  - It's rendered once at build time.
- **`app/menu/[id]/opengraph-image.js`:** one card per dish, generated at build time from the record.
  - It shows the photo, name, category, spice level, the first line of the description and the price in ETB.
  - `generateImageMetadata` gives each card its own `og:image:alt`, e.g. "Special Kitfo, 480 ETB, at Addis Eats".
- **Rendered tags:** both come out as `og:image` / `twitter:image` with absolute URLs, `og:image:width` 1200, `og:image:height` 630, and an alt.
- **Known limit, file size:**
  - The site card is about 1.2 MB and a dish card about 640 KB. `ImageResponse` only produces PNG, and photos (especially the grainy stand-in dish photos) compress poorly as PNG.
  - Facebook, X and Slack accept that. WhatsApp is known to skip preview images much over ~600 KB.
  - Real, smoother dish photos would shrink the dish cards. The site card could become a pre-rendered `opengraph-image.jpg`.

## Structured data

On `/menu/[id]`, a `<script type="application/ld+json">` holds a schema.org **MenuItem**:
- **Fields:** `name`, `alternateName` (Amharic), `description`, `url`, `image`, `suitableForDiet: VeganDiet` (fasting dishes only), and an `Offer` with `price` and `priceCurrency: "ETB"`.
- **Same source as the page:** `name` and `price` come from the same fields the page renders. Checked: Doro Wat's JSON-LD says `450 ETB`, and the page shows "450 ETB"; Special Kitfo is `480 ETB` in both.
- **Escaping:** `<` is escaped in the JSON, so a value can never close the script tag.

## Sitemap and robots

- **`app/sitemap.js` → `/sitemap.xml`:** generated from `getAllDishes()` and `getCategories()`.
  - **Listed:** `/`, `/menu`, the three category pages and all 12 dishes, 17 URLs in all, every one absolute.
  - **Not listed:** **0** routes that need signing in, and the noindex pages `/cart` and `/sign-in` are left out too.
  - **No `lastModified`:** the records don't say when a dish changed, and an invented date would be worse than none.
- **`app/robots.js` → `/robots.txt`:** `Disallow` for `/checkout`, `/orders`, `/kitchen` and `/api/`, plus the sitemap's absolute URL.
  - `/cart` and `/sign-in` are deliberately *not* disallowed. They carry a noindex meta tag, and a crawler only sees that tag on a page it's allowed to fetch.

## Check yourself

- **Does the page source show absolute URLs in every og:image tag?**
  - Yes. On `/`, `/menu`, a category page, two dish pages, `/cart`, `/sign-in` and the 404, every `og:image` starts with `https://addis-eats.example/`.
- **Do two different dish pages have two different descriptions?**
  - Yes. Every one of the 12 is different (see above).
- **Does your sitemap contain any route that requires signing in?**
  - No. Checked by searching the generated XML for `checkout`, `orders`, `kitchen`, `cart` and `sign-in`: 0 matches.
- **Does the JSON-LD price match the price on the page, in ETB?**
  - Yes: `450` / `ETB` against "450 ETB" on Doro Wat, and `480` / `ETB` against "480 ETB" on Special Kitfo.
- **Is there exactly one h1 on each page, and does it describe the page?**
  - One on every route checked. The menu's `h1` now follows the category ("Tibs dishes"), where before it said "Our Ethiopian Menu" on every filter.
  - On a dish page the `h1` is the dish name.
- **Would a link to a dish look worth opening if you saw it in a group chat?**
  - The card has the dish photo, the name, its tags, a one-line pitch and the price.
  - The weak points:
    - the dish photos are stand-ins, not real food
    - the card file sizes may be too big for WhatsApp (see above)

## Not covered

- **No real production URL yet:** set `SITE_URL` before deploying, or every absolute URL points at the placeholder or localhost.
- **No preview-debugger check:** I checked the tags in the page source. Running the live URL through Facebook's Sharing Debugger or opengraph.xyz needs a public deployment.

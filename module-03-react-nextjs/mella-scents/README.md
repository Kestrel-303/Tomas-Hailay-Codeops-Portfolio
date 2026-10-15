# Mella Scents

A luxury fragrance shop for Addis Ababa, built on the **Next.js 16 App Router**. You browse the collection, search and filter it, save favourites, fill a bag, check out with TeleBirr, and keep a receipt for every order.

It's the original **Mella Scents** (the Vite + React Router app in `mini-projects/Mella_Scents`) rebuilt as the final, deployment-ready project for Module 3. It keeps the same design and data, and gains a real server behind it.

## Live URL

**Not deployed yet.** Deploying needs the project owner's Vercel account (steps below). Put the production URL here once it's live:

> https://… .vercel.app

**Demo accounts:**
- `selam@mellascents.et` / `mella123`
- `dawit@mellascents.et` / `mella123`

**TeleBirr test number:** checking out with `0900000000` shows the "payment declined" path. Every other valid number succeeds.

## What changed from the Vite version

| | Vite + React Router | Next.js (this app) |
|---|---|---|
| Product data | Fetched in the browser, with "Loading fragrances…" first | Fetched on the server, so it's in the HTML. Cached and refreshed hourly (ISR), with a committed snapshot used if DummyJSON is down |
| Product photos | Hotlinked from `cdn.dummyjson.com` | Served from `public/products`. The CDN answered with a 522 timeout during testing and sends `no-store` |
| Prices | `$89.99` on the product, then charged as "ETB 90" | **ETB everywhere** (ETB 13,500). Converted once on the server at a fixed rate, and charged exactly as shown |
| Sign-in | Any email, no password, stored in localStorage | Demo accounts with scrypt-hashed passwords, and an HMAC-signed `httpOnly` session cookie that is revoked on sign-out |
| Private pages | A client-side redirect, which anyone could skip | Three layers: `proxy.js`, then the page, then the server action or route handler |
| Checkout | A `setTimeout` that failed at random 1 time in 10 | A server action: it validates every field again, prices the bag from the catalogue, and places one order per submission |
| Receipt | Navigation state, lost on refresh | `/orders/[id]`, a real page only its owner can open, plus an order history on `/account` |
| Product page | No way to buy | Photo gallery, add to bag, wishlist, stock, reviews, delivery and returns |
| Quick View | Appeared only on mouse hover; sat inside a link | Always visible. A native `<dialog>`: Escape closes it, the page behind is inert, and focus returns to the button |
| Fonts | A render-blocking Google Fonts `<link>` | `next/font`, served from this site |
| SEO | One title for every page | Titles and descriptions per page, link-preview cards, Product JSON-LD in ETB, a sitemap, robots.txt and canonical URLs |

## How it's built

### Routes and rendering

| Route | Rendering | Why |
|---|---|---|
| `/` | Static, ISR every hour | Same for every visitor; the featured products change only with the catalogue |
| `/shop` | Static, ISR every hour | Every product is rendered on the server. Search (`?q=`) and price (`?max=`) filter in the browser, so the page stays cached |
| `/product/[id]` | Prerendered for all 5 ids, ISR every hour; `dynamicParams = false` | Every id is known at build time, and any other id is a real 404 |
| `/about` | Static | Never changes |
| `/cart`, `/wishlist` | Static shell, filled in the browser | The bag and wishlist belong to this browser |
| `/login` | Dynamic | Reads `?next=` |
| `/checkout` | Dynamic | Reads the session and the bag cookie; prices the order on the server |
| `/orders/[id]`, `/account` | Dynamic | Read the session; owner-only |
| `/api/products`, `/api/products/[id]` | Route handlers | The catalogue in ETB, for outside callers. The pages read `lib/products.js` directly |
| `/api/orders` (POST), `/api/orders/[id]` (GET) | Route handlers | Order intake and lookup for non-browser clients, with the same rules as checkout |
| `/api/session` | Route handler | Who's signed in, for the header, without the root layout reading cookies |
| `/opengraph-image`, `/sitemap.xml`, `/robots.txt` | Static | Built once |

### Server and client

Pages, layouts, the footer and product cards are **server components**. Client components are only the parts that react to the user:
- the header (counts, phone menu)
- the bag and wishlist buttons
- Quick View
- the gallery
- the shop filters
- the bag and wishlist pages
- the sign-in and checkout forms

One `ShopProvider` holds the bag, the wishlist and the signed-in name. It replaces the Vite version's two Zustand stores and `AuthContext`, so the app's only dependencies are `next`, `react` and `react-dom`.

### Data

- **The catalogue:** `lib/products.js` (server-only) fetches DummyJSON with `revalidate: 3600` and a 5-second timeout.
  - On any failure it falls back to `lib/catalog-snapshot.json`.
  - Tested: with the API pointed at a dead address, the build logged "using the committed snapshot" and every page still listed the fragrances.
  - Prices are converted with `usdToEtb()` (rate 150, rounded to 10 birr).
- **The bag:** product ids and quantities are kept in an `ms_bag` cookie, so the server can read it at checkout. Names, photos and prices for display are kept in localStorage. The server never trusts them.
- **Orders:** an in-memory store (`lib/orders.js`) with one order per `requestId`.

### Security

- **Session:** the `ms_session` cookie is `httpOnly`, `SameSite=Lax`, `Secure` in production, and HMAC-SHA256 signed. It lasts 8 hours, and signing out revokes its id.
- **Three layers on every private route:** `proxy.js`, then the page, then the server action or route handler.
  - Someone else's order returns the same 404 as an order that doesn't exist.
- **Server action:** the checkout action re-validates everything and prices from the catalogue, never from the request.
- **Login redirect:** `?next=` only accepts paths on this site.
- **Secrets:** they are read only in `lib/session-token.js` (server-only), and no variable has a `NEXT_PUBLIC_` prefix.

## Checked on a production build (`next build && next start`, Chrome)

**A whole order by keyboard alone,** with no mouse:
1. Sign in.
2. Open Dior J'adore and press Enter on "Add to bag" twice. The bag count shows 2.
3. Go to checkout and type every field (typing "K" in the area list picks Kazanchis).
4. Press Enter twice on "Pay ETB 27,000 with TeleBirr".

The result:
- **One order request** was sent.
- **The receipt** reads "Thank you, Selam", Kazanchis, total ETB 27,000.
- **The bag** is emptied.

**Every other check passed:**

| Check | Result |
|---|---|
| Products in the HTML before JavaScript | Home and shop HTML list the fragrances with ETB prices |
| Shop filters in the URL | `?q=dior` shows 1; `?max=9000` shows only fragrances up to ETB 9,000 |
| Quick View by keyboard | Enter opens it. Tab moves through its 3 controls and the browser's own UI, never the page behind. Escape closes it and focus returns to its button |
| Wishlist while signed out | The heart goes to sign-in and comes back to the same page afterwards |
| Double tap on Pay | Two clicks in the same instant: **1** order. A touch double tap at 390px: **1** order |
| TeleBirr decline (`0900000000`) | Stays on checkout with "TeleBirr declined the payment…", and focus moves to the message |
| Invalid phone | The message appears beside the field, focus moves there, and the field gets `aria-invalid` |
| Another customer's order | Dawit opening Selam's receipt: **404**. Through the API: **404** |
| Price tampering | An API order claiming `"price": 1` is charged the real **ETB 19,500** |
| Signed out | `/checkout`, `/account` and `/orders/…` redirect to sign-in (307); the order API answers 401 |
| Reusing a cookie after sign-out | Redirected to sign-in: the session id was revoked |
| Focus | A visible ring on **all 220 Tab stops** across 11 pages; a skip link; nothing reachable only by mouse |
| Touch targets | **0** controls under 44 × 44px at 390px wide, on every page |
| Responsive | 11 pages × 5 widths (360 to 1440px): no sideways scrolling and nothing cut off. The menu collapses behind a Menu button below 820px, and on a phone the checkout summary comes before the form |
| `npm test` | 8 passing: ETB conversion, the bag cookie, checkout rules, pricing from the catalogue, safe redirects, session signatures |

## Pre-flight checklist

| | |
|---|---|
| `npm run build` | ✓ No errors |
| `npm test` | ✓ 8 passing |
| Every variable documented in `.env.example` | ✓ `SESSION_SECRET` (required, 32+ characters) and `SITE_URL` (optional) |
| `.env.local` git-ignored | ✓ |
| No secret in the browser | ✓ `.next/static`: 0 hits for the secret's value, its name, `scryptSync`/`createHmac`, or the demo password. Over HTTP, the 15 JavaScript files the pages load (646 KB) contain none of them either |
| A missing secret fails safely | ✓ Every page still loads; signing in shows the friendly error page; the server log says "SESSION_SECRET is missing… On Vercel: Settings → Environment Variables…" |
| Real 404s | ✓ `/product/999` and unknown URLs |
| API down | ✓ The snapshot is used and the shop still works |
| `scripts/check-live.mjs` on a local production build | ✓ Everything passes except "served over HTTPS", which only a deployment can |

## Run it locally

```bash
npm install
cp .env.example .env.local   # then set SESSION_SECRET (the file shows how to generate one)
npm run build && npm start   # http://localhost:3000
npm test
```

## Deploy to Vercel

1. Import the repository at <https://vercel.com/new> and set **Root Directory** to `module-03-react-nextjs/mella-scents`. The framework is Next.js; keep the default commands.
2. **Settings → Environment Variables**, one environment at a time:

| Variable | Production | Preview | Development |
|---|---|---|---|
| `SESSION_SECRET` | a new random value (32+ characters) | a **different** random value | only in your `.env.local` |
| `SITE_URL` | only with a custom domain | leave unset: each preview uses its own URL | leave unset |

   Generate each secret with `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`. Never reuse the value in `.env.local`.

3. **Deploy.** Redeploy after any variable change: link cards and the sitemap use the address from build time.
4. **In a private window:**
   - Run `SESSION_SECRET=<production value> node scripts/check-live.mjs https://<your-app>.vercel.app`.
   - Then check by hand:
     - Sign in, and check in DevTools → Application that `ms_session` is **HttpOnly, Secure, SameSite=Lax**.
     - Order by keyboard with a double Enter, and confirm one receipt appears.
     - Open the receipt from `/account`.
     - Sign out.
     - Paste a fragrance URL into a chat app: it shows the bottle's photo as a card.
5. **Rolling back:** Deployments → the last good deployment → **⋯ → Promote to Production** (or `vercel rollback`). Environment variable changes don't roll back with it.

## Known limits

- **Orders and sign-outs live in server memory.** On Vercel, requests can reach different serverless instances, so an order or a receipt may not be found on the next request. A single `npm start` process is fully reliable; a database (Postgres, Redis) is the fix.
- **Demo accounts only.** Accounts are a fixed list; there's no sign-up.
- **Payment is simulated.** There's no TeleBirr sandbox: every valid number "pays", except `0900000000`, which is declined.
- **The ETB rate is fixed** (1 USD = 150 ETB) and isn't a live exchange rate. Prices stay stable and the checkout charges what the shop showed.
- **Product data and photos come from [DummyJSON](https://dummyjson.com),** a public test API, as in the Vite version.
- **Performance:** Lighthouse wasn't measured for this build. This laptop's background load made earlier measurements unreliable. Run PageSpeed Insights on the deployed URL for a fair number.

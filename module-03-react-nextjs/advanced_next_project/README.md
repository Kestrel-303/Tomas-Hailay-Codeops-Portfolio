# Addis Eats

A full-stack Ethiopian food-ordering app on the Next.js 16 App Router. This is the finished project: everything from mini-projects 13–20 and days 39–44 in one app, built from that code and ready to deploy to Vercel.

## Live URL

**Not deployed yet.** Deploying needs the project owner's Vercel account (steps below). Once it's live, put the production URL here:

> https://… .vercel.app

## What it does

**Customers**
- Browse the menu by category, page through it, or search the whole menu as you type (debounced, Esc clears).
- Open a dish page with its photo, ingredients, spice level and ETB price; add to cart.
- Change quantities in the cart, see subtotal, delivery fee and VAT, and check out with a neighbourhood, an address and Telebirr, CBE Birr or cash.
- Sign in and see **My Orders**, cancel an order until the kitchen starts, and download the order history as CSV.
- **Track an order live:** a Leaflet map of the courier and the delivery address, the same information written out beside it, and a status that streams from the server (Server-Sent Events) from placed to delivered.

**Kitchen staff** (`kitchen@addiseats.et`)
- The **Kitchen Order Board** with every order.
- A **Dashboard**: revenue by neighbourhood and orders per day over 14 days, each chart repeated as a table, and a sortable, paged order table driven by the URL.

**Demo accounts:** `abebe@example.com` / `injera123`, `tirunesh@example.com` / `injera123`, `kitchen@addiseats.et` / `kitchen123` (staff).

## How each part is built, and the write-ups

| Area | What's in it | Write-up |
|---|---|---|
| Authentication and authorisation | HMAC-signed `httpOnly` / `secure` / `sameSite` session cookie, three layers on every private route (proxy → page → action/handler), queries scoped to the verified session, a staff-only kitchen, attacks tested from the browser console, one order per double submit | [AUTH.md](./AUTH.md) |
| Data fetching and live data | Server-rendered pages seeded into SWR, a debounced search, a paged menu, and a live order stream over SSE closed on unmount and on delivery | [DATA.md](./DATA.md), [TRACKING.md](./TRACKING.md) |
| Performance | `next/image`, `next/font`, `next/script`, no hero preload, all images served from `public/`, a budget table and the final re-measurement | [PERF.md](./PERF.md) |
| Metadata and SEO | Titles and descriptions on every route, 1200×630 link-preview cards (site-wide and per dish), MenuItem JSON-LD, `sitemap.xml`, `robots.txt`, canonical URLs | [SEO.md](./SEO.md) |
| Reports | The staff dashboard: server-side aggregation, readable charts, accessible tables | [DASHBOARD.md](./DASHBOARD.md) |
| Keyboard, touch and shipping | Every function by keyboard, visible focus, 44px targets, a phone menu, no double submits, the pre-flight checklist, Vercel variables per environment, post-deploy checks, rollback | [SHIP.md](./SHIP.md) |
| Server and client components | Which components run where, and why | [BOUNDARY.md](./BOUNDARY.md) |

## Final checks (production build, Chrome)

- **Every page at every width:** 11 pages at 360, 390, 768, 1024 and 1440px wide (55 combinations): no horizontal scrolling and nothing past the screen edge. Phones and tablets get the Menu button; the cart, checkout rows and dish actions stack on narrow screens; the menu comes before the sidebar.
- **Keyboard only:** an order placed start to finish with Tab, Enter and typing. A visible focus ring on all 155 Tab stops across 9 pages, no pointer-only elements, no control under 44 × 44px.
- **Double taps:** double Enter, two simultaneous clicks and a touch double tap each place **one** order.
- **Live tracking:** placed → preparing → out for delivery → delivered over the stream; 5 visits then navigating away leaves 0 open connections; no reconnect after delivery.
- **CSV:** a name with quotes and an address with a comma, quotes and a line break come back exactly as typed.
- **Deploy checks** (`scripts/check-live.mjs` on a local production build): everything passes except HTTPS, which only the deployed URL can provide. No secret in any of the 15 JavaScript files a browser downloads.
- `npm run build`: no errors. `npm test`: 9 passing.

## Run it locally

```bash
npm install
cp .env.example .env.local   # set SESSION_SECRET (the file shows how to generate one)
npm run build && npm start   # production build on http://localhost:3000
npm test                     # redirect validator, lib/format.js, lib/csv.js
```

## Deploy to Vercel

1. Import the repository at <https://vercel.com/new>. Set **Root Directory** to `module-03-react-nextjs/advanced_next_project`. The framework preset is detected as Next.js; keep the default commands.
2. Under **Settings → Environment Variables**, set each environment separately:

| Variable | Production | Preview | Development |
|---|---|---|---|
| `SESSION_SECRET` | a new random value (32+ characters) | a **different** random value | only in your `.env.local` |
| `SITE_URL` | only if you add a custom domain | leave unset (each preview uses its own URL) | leave unset |

   Generate each secret with `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`. Never reuse the one in `.env.local`.

3. Deploy. After any variable change, redeploy (variables are read at build time).
4. Run the checks against the live URL, in a private window:
   - `SESSION_SECRET=<production value> node scripts/check-live.mjs https://<your-app>.vercel.app`
   - then the manual list in [SHIP.md](./SHIP.md): sign in, place an order by keyboard with a double Enter, track it to delivered, open the staff dashboard, and paste a dish URL into a chat to see its card.
5. **Rolling back:** Vercel → Deployments → the last good deployment → **⋯ → Promote to Production** (or `vercel rollback`). Variable changes aren't rolled back with it.

**Known limit on Vercel.** Orders, double-submit `requestId`s and signed-out sessions are kept in server memory, by design for this course. Vercel can answer each request from a different serverless instance with its own memory, so on the live site an order may not appear on the next request, or its tracking page may 404. Everything is reliable on a single `npm start` process. A shared store (Postgres or Redis) is the fix.

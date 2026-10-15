# Harden, Then Ship: SHIP.md

**Hardening:** mini-project 20 is mini-project 19 hardened for:
- keyboard-only use
- real phones
- double taps

**Deployment:** it's ready for Vercel. The steps, the variables per environment, the checks and how to roll back are all below.

**How it was tested:** every number below comes from `next build && next start` in Chrome. A script drove the app with real **Tab / Enter / Escape** key presses and typing, with no mouse at all. Each check ran on mini-project 19 first ("before") and again on this code.

## Requirements

| Requirement | Before (mp19) | Now |
|---|---|---|
| No clickable divs: every interactive element is a button or a link | 0 pointer-only elements, but the category pills claimed `role="tab"` | 0 pointer-only elements. The pills are links in a `<nav>` with `aria-current="page"` |
| Visible focus everywhere | Chrome's 1px default ring | A near-white 3px `:focus-visible` ring on **all 154 Tab stops** across 9 pages |
| Every function reachable by keyboard | On a phone, **Cart, Checkout, Orders and Sign in were off-screen** | A **Menu** button (`aria-expanded`) opens them as 48px rows. Escape closes it and returns focus to the button |
| Forms handled with onSubmit, submit disabled while pending | `disabled={pending}` only: **two clicks in the same instant placed 2 orders** | `onSubmit={useSubmitOnce(pending)}` on checkout, cancel and sign-in, plus a server-side `requestId`: **1 order** |
| Touch targets of at least 44px | **77** controls under 44px at 390px wide | **0** (2 inline links inside a photo credit sentence are exempt) |
| Nothing hidden behind hover | No hover-only content found | Still none: `:hover` only changes colour |
| A clean `npm run build`, pre-flight checklist worked through | n/a | ✓ (below) |
| Deployed with variables per environment | n/a | Ready. Steps and the variable table are below. **Not yet deployed:** this needs the owner's Vercel account |
| Every post-deployment check passing, in a private window | n/a | `scripts/check-live.mjs` plus the manual list below. All pass locally except HTTPS, which only a deployment can provide |

**What else changed:**
- **"Skip to main content"** is the first Tab stop on every page.
- **Focus after a failed submit:**
  - Checkout puts focus on the first field marked `aria-invalid`. Each field is tied to its error with `aria-describedby`.
  - Sign-in puts it back in the email field.
- **Escape in the menu search box** clears it in every browser, not only Chrome. A hint under the box says so.
- **The favourites +/− buttons** were 24px and named "-" / "+". They're now 44px, named "Remove a favourite" / "Add a favourite", and the count is announced.
- **The Table Note label** is now tied to its input.
- **The payment choice** is a named `role="group"` of `aria-pressed` buttons, picked with Enter.
- **Cancel order** was 15px-tall bare text. It's now a 44px button.
- **Unknown dish URLs** are a real 404 (`dynamicParams = false`), where before they returned a 200 soft 404.

## Check yourself

**Can you place an order using only the keyboard, start to finish?**

Yes:
1. `/menu`: 10 Tabs to Doro Wat, then **Enter**.
2. Tab to **Add to Cart**, then **Enter**.
3. 8 Tabs to **Checkout**, then **Enter**.
4. Type the name and phone. Type "K" in the neighbourhood select (Kazanchis), then type the address.
5. Tab to **Place Order**, then **Enter**.

On a phone the header's links are behind **Menu**: Enter opens it, and Escape closes it.

**Does a rapid double tap on Place Order create one order or two?**

**One.** On mini-project 19 it was:
- double Enter: 1 order
- touch double tap: 1 order
- **two clicks in the same instant: 2 orders**, because `pending` flips only after a re-render

Now each of those places **1**. The server-side layer, tested alone with the same `Idempotency-Key` three times (two at once), also gives **1** order.

**Does the application work in a private window with no session?**

Yes, signed out:
- the home page, menu, dishes and sign-in all load
- `/orders`, `/checkout` and `/kitchen` redirect to sign-in
- the APIs answer 401
- unknown URLs are real 404s

All of that is in `check-live.mjs`. One more check: with `SESSION_SECRET` missing, signed-out browsing still works, but **sign-in fails**. That's why signing in is the first manual check after deploying.

**Is any secret visible in the JavaScript the browser downloads?**

No:
- **The local build:** `.next/static` contains the `SESSION_SECRET` value 0 times, the name 0 times, and `createHmac`/`scryptSync` 0 times.
- **What a browser actually downloads:** `check-live.mjs` fetched all **15** JavaScript files the pages load (627 KB) and searched them for both the name and the value. It found 0.
- **Why it can't leak:** `lib/session.js` imports `server-only`, and nothing has a `NEXT_PUBLIC_` prefix.

**Does a shared link from the live URL render as a card?**

The tags and image are verified: on a dish page, `og:title`, `twitter:card = summary_large_image`, and an absolute `og:image` that loads (**200 image/png**).

There's one catch, found while testing: **`SITE_URL` is read at build time.** Setting it only when starting the server left the cards pointing at `localhost:3000`.
- So `lib/site.js` now takes the address of the Vercel build itself:
  - the production domain for Production
  - the preview's own URL for Preview, so a preview's cards don't point at production
- `SITE_URL` is only needed for a custom domain.

With the right build-time address, every card check passed. For a real card, paste the live URL into a chat, or use a preview tool such as opengraph.xyz.

**Do you know how to roll back, without looking it up?**

Vercel → the project → **Deployments** → the last good deployment → **⋯ → Promote to Production** (Instant Rollback: no rebuild, live in seconds).
- **CLI:** `vercel rollback`.
- **Undo the rollback:** promote the newer deployment again.
- **What it doesn't undo:** environment variable changes. Those need a redeploy.

## Pre-flight checklist

| | |
|---|---|
| `npm run build` | ✓ No errors, no warnings |
| `npm test` | ✓ 9 passing |
| Route table read | ✓ Below |
| Every variable documented in `.env.example` | ✓ `SESSION_SECRET` (required, 32+ characters), `SITE_URL` (optional) |
| `.env.local` git-ignored | ✓ |
| No secret in client JavaScript | ✓ 0 hits locally and over HTTP |
| A missing secret fails loudly | ✓ Sign-in errors with "SESSION_SECRET is missing or under 32 characters: set it in .env.local, or in the Vercel project for this environment." |
| Real 404s | ✓ |
| Keyboard, touch, double-submit | ✓ Above |

**The route table:**

```
┌ ○ /                                ├ ƒ /kitchen, /kitchen/dashboard
├ ○ /_not-found                      ├ ƒ /menu
├ ƒ /api/dishes, /[id], /search      ├ ● /menu/[id]  (12 dishes)
├ ƒ /api/menu                        ├ ● /menu/[id]/opengraph-image/…
├ ƒ /api/orders, /[id], /[id]/stream ├ ○ /opengraph-image
├ ƒ /api/session                     ├ ƒ /orders, /orders/[id], /orders/export.csv
├ ƒ /cart, /checkout                 ├ ○ /robots.txt, ○ /sitemap.xml
                                     └ ƒ /sign-in
ƒ Proxy (Middleware)
```

What it shows:
- **Static (○ / ●):** the home page, the 12 dish pages, their card images, robots and the sitemap.
- **Dynamic (ƒ):**
  - everything that reads the session
  - every API route
  - `/menu`, because of its query string
  - `/cart`, which reads `searchParams`
- **Nothing personal is static.**

**Known limit before deploying:** orders, `requestId`s and revoked sessions are kept **in memory**.
- On Vercel, requests can reach different function instances, so an order or its tracking page can go missing.
- That's the course's in-memory choice. The fix is a database.

## Deploying to Vercel

1. **Import the project:** Vercel → Add New → Project → import `Tomas-Hailay-Gidey-SQ7`.
2. **Root Directory:** `module-03-react-nextjs/advanced_next_project`. Framework: Next.js, with the default commands.
3. **Environment variables, set per environment:**

| Variable | Production | Preview | Development |
|---|---|---|---|
| `SESSION_SECRET` | its own random value | a **different** random value | only in your `.env.local` |
| `SITE_URL` | only if you add a custom domain (e.g. `https://addiseats.et`) | leave unset: uses the preview's own URL | leave unset: `http://localhost:3000` |

   Generate each secret with `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`.

4. **Deploy,** then copy the production URL into the README.
5. **Redeploy after any variable change.** Variables are read at build time and at start-up.

## Post-deployment checks, in a private window

**Automatic:** `SESSION_SECRET=<production value> node scripts/check-live.mjs https://<app>.vercel.app`

**By hand, in a private window:**

1. Sign in as `abebe@example.com` / `injera123`.
2. In DevTools → Application, `ae_session` is **HttpOnly, Secure, SameSite=Lax**.
3. Place an order by keyboard only, with **Enter twice** on Place Order. My Orders shows **one** new order.
4. Open the order: the map draws, the indicator reads **Live**, and about 90 s later it reaches **Delivered**.
5. At phone width, **Menu** opens and **Escape** closes it.
6. Sign in as `kitchen@addiseats.et` / `kitchen123`. The Dashboard loads. As a customer, `/kitchen` is a **404**.
7. Paste the URL of a dish page into a chat app: it shows a card with the dish photo and price.

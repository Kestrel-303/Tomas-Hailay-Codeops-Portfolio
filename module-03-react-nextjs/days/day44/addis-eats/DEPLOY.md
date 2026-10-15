# Day 44: Shipping Addis Eats

## 5. `npm run build`: the route table

```
Route (app)                                 Size  First Load JS
┌ ○ /                                      170 B         107 kB
├ ○ /_not-found                            152 B         103 kB
├ ƒ /api/dishes … /api/session               152 B         103 kB   (every API route)
├ ○ /cart                                1.92 kB         109 kB
├ ƒ /checkout                            3.04 kB         110 kB
├ ○ /home                                  174 B         112 kB
├ ƒ /kitchen                               170 B         107 kB
├ ƒ /kitchen/reports                      114 kB         221 kB
├ ƒ /kitchen/reports/orders.csv            150 B         103 kB
├ ƒ /menu                                  586 B         112 kB
├ ● /menu/[id]                             975 B         113 kB   (13 dish pages)
├ ƒ /orders                                779 B         107 kB
├ ƒ /orders/[id]                         2.93 kB         110 kB
├ ○ /search                              2.51 kB         120 kB
└ ƒ /sign-in                               869 B         104 kB
+ First Load JS shared by all             103 kB
ƒ Middleware                             34.6 kB
```

(From the final build of this commit.)

**Reading it:**
- **○ Static, ● prerendered:**
  - `/home`, `/cart`, `/search` and the 13 dish pages are built once and served from the CDN.
  - `/menu/[id]` now sets `dynamicParams = false`, so an unknown dish is a real **404**, not the 200 "soft 404" it used to be.
- **ƒ Dynamic:**
  - The pages that read the session cookie: checkout, orders, kitchen and sign-in.
  - `/menu`, because its category filter is a query parameter.
  - Every API route.
  - Nothing private is static. `/orders` and `/kitchen` are ƒ, so a cached copy of one person's data can't be served to someone else.
- **Size:**
  - `/kitchen/reports` is the heaviest page at 221 kB, because of Recharts. It's staff-only, so customers never download it.
  - The tracking map (Leaflet) isn't in `/orders/[id]`'s 110 kB. It's a separate chunk loaded with `ssr: false`.

## Pre-flight checklist

| Check | Result |
|---|---|
| `npm run build` passes | ✓ No errors, no warnings |
| `npm test` passes | ✓ 9 tests (safe redirects, `lib/format.js`, `lib/csv.js`) |
| Every environment variable is documented | ✓ There's only one, `SESSION_SECRET`, in `.env.example` with the command to generate it |
| `.env.local` stays out of git | ✓ `git check-ignore` matches `.env*.local` |
| No secret in the browser bundle | ✓ The secret's value: 0 files in `.next/static`. The name `SESSION_SECRET`: 0. The password-hashing code (`scryptSync`): 0 |
| A missing secret fails loudly | ✓ Tested with `.env.local` removed. Signed-out pages still worked, and the first **sign-in** crashed with "SESSION_SECRET must be set in production". So after deploying, a sign-in test is required, not just opening the homepage |
| Private routes are dynamic and protected | ✓ See the route table. `middleware.js` covers `/checkout` and `/orders`, and every page and API route checks again |
| Real 404s | ✓ Unknown dish and unknown path both return 404, with a site-wide `app/not-found.jsx` |
| Keyboard and touch pass | ✓ KEYBOARD.md |
| Signed-out checks, locally | ✓ `node scripts/check-live.mjs http://localhost:3000`: everything passes except "HTTPS", which only a deployed URL can pass |

**Known before deploying: in-memory orders.** Orders, the double-submit `requestId`s and the revoked sessions live in the server's memory.
- On Vercel each function instance has its own memory, and instances come and go.
- So an order can disappear, or a tracking page can 404, when a request lands on a different instance from the one that placed it.
- This is the "keep it in memory" choice made earlier for the course. The fix is a database (for example Vercel Postgres or Upstash Redis) and is out of scope today. The post-deploy checks below will show whether it bites.
- The tracking stream also counts against the function's time limit (about 90 s per order here, within Vercel's default).

## 6. Deploying to Vercel, with variables per environment

This app lives in a sub-folder of the course repository, so the Vercel project needs its **Root Directory** set.

1. **Import the project.** Vercel → **Add New… → Project** → import `Tomas-Hailay-Gidey-SQ7` from GitHub.
2. **Configure it:**
   - **Root Directory:** `module-03-react-nextjs/days/day44/addis-eats`
   - **Framework Preset:** Next.js (detected)
   - **Build Command:** `next build` (default)
   - **Install Command:** `npm install` (default)
3. **Environment Variables:** add `SESSION_SECRET` **separately for each environment**, so a leaked preview secret can't sign production cookies.

| Variable | Production | Preview | Development |
|---|---|---|---|
| `SESSION_SECRET` | a new random value | a **different** random value | not on Vercel: your own `.env.local` (or `vercel env pull`) |

   Generate each value with `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`. Never reuse the one in your `.env.local`.

4. **Deploy.** Vercel builds and gives a production URL like `https://addis-eats-….vercel.app`.
5. **After changing a variable, redeploy.** Variables are read at build and boot time, so a new value needs a redeploy: Deployments → … → **Redeploy**.

With the Vercel CLI instead: `vercel link`, then `vercel env add SESSION_SECRET production` and `vercel env add SESSION_SECRET preview`, then `vercel --prod`.

## 7. Post-deployment checks: on the live URL, in a private window

A private window has no cookies, no cache and no saved sign-in, so it sees what a first-time visitor sees.

**Automatic checks (signed out):**

```
node scripts/check-live.mjs https://<your-app>.vercel.app
```

It checks:
- HTTPS
- the home, menu and dish pages
- a real 404
- the sign-in redirects on `/orders`, `/checkout` and `/kitchen`
- 401s from the order API, the tracking stream and the CSV export
- the session API saying nobody is signed in
- immutable caching of the build files

**By hand, in a private window:**

1. **Sign in** as `abebe@example.com` / `injera123`. This proves `SESSION_SECRET` is set; without it, this step crashes.
2. In DevTools → Application → Cookies, check that **`ae_session` is `HttpOnly`, `Secure` and `SameSite=Lax`.** `Secure` only appears over HTTPS.
3. **Place an order using only the keyboard,** and press Enter twice on **Place order**. My Orders must show **one** new order.
4. **Open the order:** the map loads (OpenStreetMap tiles over HTTPS), and the indicator reads **Live**. Watch it reach **Delivered** about 90 s later, at which point the indicator reads **Finished**. If the page 404s or the status jumps backwards, the in-memory limit above is the cause.
5. **Phone layout:** open the menu at phone width (DevTools device toolbar), then press Escape: it closes.
6. **Staff:** sign out, sign in as `kitchen@addiseats.et` / `kitchen123`, open **Reports**, and download the CSV.
7. **Customer blocked from staff pages:** sign in as a customer and open `/kitchen`. It must be a **404**.

**Status:** not deployed from here. There's no Vercel account or CLI on this machine, and publishing is the project owner's step. The local run of `check-live.mjs` against the production build passes everything except HTTPS.

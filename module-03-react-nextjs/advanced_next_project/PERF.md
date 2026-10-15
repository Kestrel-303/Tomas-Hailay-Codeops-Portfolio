# Performance: PERF.md

## Budget

Standard Lighthouse 13, mobile, against a production build. Medians: 3 runs for the baseline, 5 for the final.

| Budget | Target | `/` before → after | `/menu` before → after | `/menu/[id]` before → after | Met? |
|---|---|---|---|---|---|
| Lighthouse performance score | ≥ 90 | 76 → **92** | 93 → **93** | 95 → **92** | **Yes**, all three |
| Largest Contentful Paint (simulated) | < 2.5 s | 3.38 s → **3.05 s** | 2.97 s → **3.11 s** | 2.81 s → **2.88 s** | **No** (see below) |
| Largest Contentful Paint (observed, unthrottled) | (for context) | 0.37 s → **0.40 s** | 0.53 s | 0.51 s | n/a |
| Cumulative Layout Shift | < 0.1 | 0 → **0** | 0 → 0 | 0 → 0 | **Yes** |
| Total Blocking Time | < 200 ms | 638 → **137 ms** | 146 → 126 ms | 94 → 199 ms | **Yes** |
| Page weight | < 500 KB | 381 → **382 KB** | 379 → 378 KB | 256 → 256 KB | **Yes** |

- **"Before"** is the app as it stood after mini-projects 16 (images, fonts, scripts) and 17 (SEO).
- **"After"** is the final app, which has one more change, below.
- **Noise:** run-to-run variation is about ±0.3 s on LCP and ±3 on the score. The `/menu` and `/menu/[id]` columns didn't change in code, so their small before/after differences are that noise.

## How it was measured

- **Build:** `npm run build && npm start`. Never `npm run dev`, which is unminified and compiles on demand.
- **Lighthouse settings:** the default mobile config, the setup "Lighthouse score" normally means. It emulates a mid-range phone and *simulates* slow 4G and a 4× slower CPU.
- **Power:** the laptop was **plugged in**. An earlier attempt on battery ran about 5× slower with the CPU throttled, and was thrown away.
- **Cooldown:** each build was followed by a 30 s pause before measuring.

## The change that moved the score: no preload on the hero

- **Before:** the home page preloaded its hero photo (`preload`, Next 16's `priority`). It was the largest image above the fold, so preloading it looked right.
- **The catch:** Lighthouse showed the LCP element is the **headline**, not the photo. The preload pushed ~50 KB of photo onto the critical path ahead of the text everyone actually waits for.
- **Removing it:** home went **76 → 91** (TBT 638 → 231 ms, Speed Index 2.46 → 0.95 s), and **92** in the final 5-run measurement.
- **Rule worth remembering:** preload the LCP element, not "the biggest picture".

## What I tried and didn't keep

| Experiment (on top of no hero preload) | `/` score | `/` LCP | Verdict |
|---|---|---|---|
| `preload: false` on the Outfit font | 93 | 3.17 s | **Rejected.** LCP didn't move, and CLS went from 0 to **0.013**, because the font now swapped in after first paint and shifted the headline. |
| `experimental.inlineCss` (CSS inlined into the HTML) | 87 | 3.22 s | **Rejected.** Mixed: `/menu/[id]` reached 2.47 s, but `/` and `/menu` got slightly worse. Within noise, and it's an experimental flag. |

## Why LCP is still about 3 s

- **The page really paints the headline at 0.4 s.** In the unthrottled trace Lighthouse records, FCP and LCP are the same moment: 0.40 s on `/`, about 0.5 s on the others. Nothing on the page delays the headline.
- **The 3 s is Lighthouse's *simulation*.** It estimates how long that paint would take on slow 4G and a slow CPU, counting everything that loaded before it.
- **What it counts is JavaScript.** Every page loads about **155 KB (gzipped)** of JavaScript:
  - React (71 KB)
  - the Next.js runtime (36 KB)
  - small chunks of app code

  It all starts downloading before the first paint, so the simulation charges it to LCP. The app's own client code (the cart, header, SWR and confetti glue) is only a few KB per chunk.
- **What would get it under 2.5 s:** shipping less framework JavaScript to the public pages, for example:
  - making the header's session check and the cart counter non-blocking islands loaded after paint
  - dropping client components from the home page entirely

  That's a structural change I didn't make blind; it's the next thing to try.

## How the earlier work got here (mini-project 16)

Those measurements used a stricter custom setup (DevTools-applied throttling), so they aren't directly comparable with the table above, but the direction holds:

| Change | Effect |
|---|---|
| Every `<img>` → `next/image` with real `width`/`height` and `sizes` | Home page weight **2,239 KB → 378 KB**. The hero went from a 1.2 MB JPEG to a 51 KB WebP on phones. |
| Google Fonts `@import` → `next/font` (Outfit; an unused second font dropped) | CLS **0.016 → 0**, TBT −175 ms, no requests to Google |
| Blocking third-party `<script>` → `next/script lazyOnload` | No longer on the critical path. With the CDN 5 s slow, first paint went from 5.4 s to 0.3 s. |
| No remote images at all (final version) | The hero moved into `public/images` after Wikimedia answered the optimizer with 429s; `next.config.mjs` has no `remotePatterns`, so `/_next/image` refuses every remote URL |

## Bundle check

Every file in `.next/static` was searched after the final build. None contains the `SESSION_SECRET` value, demo passwords, password hashes, `scryptSync`, `createHmac` or `ownerId`, and no variable uses `NEXT_PUBLIC_`.

## Final build (after merging mini-projects 18–20)

The final app adds the staff dashboard (Recharts, staff-only), live tracking (Leaflet, loaded with `ssr: false` only on `/orders/[id]`), `lib/format.js`, the phone menu and the keyboard/touch fixes. Two things were checked.

**Did the public pages get heavier?**
- The home page loads 11 scripts, 187 KB gzipped. Recharts and Leaflet aren't among them: they're only in the staff dashboard and tracking page chunks.
- CLS is **0** on `/`, `/menu` and `/menu/doro-wat`.
- The hero moved from hotlinked Wikimedia to `public/images/hero-injera.jpg` (a 2400px, 582 KB copy, which next/image serves resized as WebP/AVIF). That was a fix, not a speed choice: Wikimedia had refused 13 of the optimizer's 15 size requests with **429 Too Many Requests**, which left a broken hero on wide screens.

**Lighthouse, re-run (standard mobile, 3-run medians, 15 Oct 2026):**

| Page | Final app | Control: mini-project 17, same machine, same hour |
|---|---|---|
| `/` | 73 (LCP 3.4 s, TBT 0.77 s, CLS 0) | — |
| `/menu` | 62 (LCP 3.4 s, TBT 1.5 s, CLS 0) | **62** (LCP 3.5 s, TBT 1.6 s) |
| `/menu/doro-wat` | 69 (LCP 3.1 s, TBT 1.2 s, CLS 0) | — |

These are well below the 92–93 in the table at the top, but the control explains why:
- **The unchanged mini-project 17 menu scored the same 62 under the same conditions.** Its code is what scored 92–93 before.
- The machine was under heavy background load during the run (WPS Office, CrossDeviceService and several Chrome processes were the top CPU users). Lighthouse's simulated throttling multiplies whatever the CPU is already doing, so Total Blocking Time rose for both builds alike.
- So the drop is the measuring machine, not a regression in the code.

**To get a fair final number:** run Lighthouse against the deployed URL (PageSpeed Insights runs it on Google's servers), or locally with nothing else running and the laptop plugged in.

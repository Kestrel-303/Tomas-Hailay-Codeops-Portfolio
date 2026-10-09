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
| Remote image host pinned in `remotePatterns` | Unlisted hosts and other folders get 400, so `/_next/image` isn't an open proxy |

## Bundle check

Every file in `.next/static` was searched after the final build. None contains the `SESSION_SECRET` value, demo passwords, password hashes, `scryptSync`, `createHmac` or `ownerId`, and no variable uses `NEXT_PUBLIC_`.

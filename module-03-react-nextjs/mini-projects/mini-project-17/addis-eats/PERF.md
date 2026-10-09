# Making Addis Eats Fast: PERF.md

A Lighthouse baseline on a production build before any change, then one change at a time, measured again after each.

**Short version:**
- **Page weight:** 2,239 KB → 379 KB.
- **CLS:** 0.016 → 0. The page no longer jumps.
- **TBT:** 492 → 288 ms.
- **Lighthouse performance score:** 71 → 80.
- **LCP:** barely moved (3.39 s → 3.32 s, within noise), and the reason is below.

## How it was measured

- **Build:** `npm run build && npm start`. Never `npm run dev`, which is unminified, compiles on demand and isn't what users get.
- **Tool:** Lighthouse 13 with its user-flow API, driving the installed Chrome.
- **Throttling:** mobile (412×823), slow 4G (150 ms RTT, ~1.6 Mbps down), CPU 4× slower, applied for real (DevTools throttling) so interactions are throttled too.
- **LCP, CLS, TBT, page weight:** a cold navigation to `/`.
- **INP:** Lighthouse only reports INP for real interactions, so a timespan clicks "🛒 Add to Cart" on `/menu/doro-wat`.
- **Runs:** 5 per step, reporting the **median**. Each build was followed by a 60 s pause, because measuring straight after `next build`, while the machine is still busy, inflates and scatters the numbers.

## The starting point

Mini-project 15 showed emoji instead of photos and loaded no third-party script, so the brief's image and script requirements had nothing to work on. I first added them the way they usually arrive, and that became the baseline:

- **Hero photo:** a real photo hotlinked from Wikimedia Commons, at its full 6016×4016 size (1.2 MB). It's a plain `<img>` with no dimensions.
  - *Injera, Fasting Food, Ethiopia* by Rod Waddington, CC BY-SA 2.0. The credit line under the hero is required by that licence.
- **Dish photos:** a 1200×900 photo per dish (~275 KB each, in `public/images/dishes/`), as plain `<img>`, replacing the emoji header on each card and on the dish page.
  - These are generated stand-ins (a gradient plus the dish's name), not real food photos.
  - Their alt text describes the dish each one stands in for, so it will be correct when real photos replace them. The hero is a real photo, and its alt text describes exactly what's in it.
- **Third-party script:** [canvas-confetti](https://github.com/catdad/canvas-confetti) from jsDelivr as a blocking `<script>` in `<head>`. "Add to Cart" fires it.

The font problem was already there: `globals.css` began with a Google Fonts `@import` for Outfit and Plus Jakarta Sans.

## Results

| Step | Perf | LCP | CLS | INP | TBT | Page weight |
| --- | --- | --- | --- | --- | --- | --- |
| Baseline | 71 | 3.39 s | **0.016** | 148 ms | 492 ms | **2,239 KB** |
| 1. `next/image` everywhere | 73 | 3.22 s | 0.016 | 153 ms | 488 ms | **378 KB** |
| 2. `preload` on the hero only | 73 | 3.27 s | 0.016 | 153 ms | 495 ms | 378 KB |
| 3. `@import` → `next/font` | 79 | 3.27 s | **0** | 148 ms | **320 ms** | 378 KB |
| 4. `next/script` `lazyOnload` | **80** | 3.32 s | 0 | 149 ms | **288 ms** | 379 KB |

In every round, Lighthouse's LCP element was **the headline** (`h1.hero-title`), not an image.

## What each change did, and why

**1. `<img>` → `next/image`: −1,861 KB (−83%).**
- **What changed:** every image now has its real `width`/`height`, a `sizes` that matches how wide it really shows, and descriptive alt text.
  - hero: `(max-width: 1200px) calc(100vw - 5rem), 1120px`
  - cards: follow the `minmax(320px, 1fr)` grid
  - dish page: a fixed `160px`
- **Why it's lighter:** Next resizes and converts on the server. A phone gets the hero as a **51 KB WebP instead of the 1.2 MB JPEG**, and each dish photo as ~25–30 KB.
- **Remote host:** next/image only optimises remote images from hosts listed in `next.config.mjs`. The one entry is pinned to protocol, host *and* folder (`https://upload.wikimedia.org/wikipedia/commons/9/98/**`). Checked: an unlisted host gets **400**, and so does another folder on the same Wikimedia host. That stops our `/_next/image` endpoint being used as an open image proxy.
- **LCP moved only 0.17 s**, within noise, because the LCP element is the headline text, not an image.

**2. `preload` on exactly one image: no measurable change.**
- **What changed:** Next 16 deprecated `priority` and replaced it with `preload` (a `<link rel="preload" as="image">` in `<head>`, and no lazy loading). It's on the hero only, the largest image above the fold. Checked: the home HTML has exactly one image preload, and every other `<img>` has `loading="lazy"`.
- **Why no change:** the hero isn't the LCP element. On a 412px phone it shows at 332×222, smaller than the 3.2rem two-line headline. It's still the right image to prioritise if anything is, but it isn't what LCP is waiting on.

**3. Google Fonts `@import` → `next/font`: CLS 0.016 → 0, TBT −175 ms, Perf +6.**
- **What changed:** Outfit is downloaded at build time, served from our own origin and preloaded. Its fallback is size-matched, so the swap doesn't move anything. There are no requests to Google any more.
- **Unused font removed:** Plus Jakarta Sans was imported but nothing in the app used it (`--font-heading` was defined and never referenced). I removed it rather than move it into `next/font`, which would have preloaded a font no element renders.
- **TBT drop:** probably because the late `@import` stylesheet, then the late font swap, each forced a full re-style and re-layout of the page. I didn't isolate that, so treat it as the likely cause, not a proven one.

**4. Blocking `<script>` → `next/script` `lazyOnload`: TBT −32 ms, no LCP change.**
- **What changed:** canvas-confetti now loads once the browser is idle after `load`. Checked: `window.confetti` is a function about 1 s after load, and "Add to Cart" calls `window.confetti?.()` in case it hasn't arrived.
- **Effect:** on a healthy network a 10.8 KB script is never the slowest thing, so LCP doesn't move. The real benefit is resilience. Day 40 measured the same change with the CDN slowed by 5 s: a blank page for 5.4 s with the blocking script, against first paint at 0.3 s with `lazyOnload`.

## Check yourself

**Did LCP improve, and can you name the single change that did most of it?**
- **Not meaningfully:** 3.39 s → 3.32 s. The biggest single move was `next/image` (−0.17 s), and that is within run-to-run noise. LCP here is the headline text, and none of these four changes targets what delays it.
- **What does delay it:** a performance trace shows the first layout pass on the home page takes **~0.5–0.9 s** on the 4×-throttled CPU, for only ~150 elements. The same measurement on a near-empty page takes ~40 ms, so it's something in this page, not Chrome.
- **What I tested:**

  | Change to the page | Effect on that layout |
  | --- | --- |
  | Remove the Amharic text | No change |
  | Block the web font | No change |
  | Remove `backdrop-filter` and gradient text | No change |
  | Remove emoji | Shorter in one run, not the other |

  So I haven't pinned it down. It's the next thing to fix, and the emoji (rendered with Windows' colour-emoji font) are the lead to follow.
- **What the four changes did deliver:** −83% bytes, no layout shift, −204 ms TBT.

**Does the page still jump as it loads? If so, what is not reserving space?**
- **No:** CLS is 0. Before, the headline moved down 0.016 when Outfit swapped in for the fallback font.
- **A misleading hint:** Lighthouse also listed the hero `<img>` as an "unsized image" culprit, and kept listing it after the image had `width`/`height` (it seems to read CSS `height: auto` as "unsized").
- **The evidence:** CLS was **identical to 4 decimal places** before and after the image got dimensions, and fell to 0 only when the font changed. In this app the image dimensions arrived before first paint either way, so the font was the only thing that didn't reserve its space.

**Are you measuring `npm start`, throttled, not `npm run dev`?**
- Yes. Every number is `next build && next start` with mobile, slow-4G and 4× CPU throttling.

**Can a stranger clone the repository and know which variables to set?**
- Yes. `.env.example` is committed and lists the one variable, `SESSION_SECRET`: what it signs, that it's server-only, its minimum length, and the command to generate one. The README's "Setup for a fresh clone" says to copy it to `.env.local`.

**Is there anything in the browser bundle you would not want published?**
- **No.** I built it and searched every file in `.next/static` (the JavaScript and CSS sent to browsers):

  | Searched for | Files containing it |
  | --- | --- |
  | The actual `SESSION_SECRET` value | 0 |
  | The name `SESSION_SECRET` | 0 |
  | Demo passwords (`injera123`, `kitchen123`) | 0 |
  | `passwordHash`, `scryptSync`, `createHmac` | 0 |
  | User ids and emails | 0 |
  | `ownerId` | 0 |

- **`NEXT_PUBLIC_`:** no variable uses it.
- **`server-only`:** `lib/session.js` and `lib/users.js` import it, so a client import would fail the build.
- **Demo emails:** they appear on the `/sign-in` page on purpose, as a demo convenience.

## Environment files

| File | Committed? |
| --- | --- |
| `.env.example` | **Yes**, no values |
| `.env` | Ignored |
| `.env.local` | Ignored |
| `.env.production.local` | Ignored |
| `.env.staging.local` | Ignored |

The rule is `.env*` with `!.env.example` in `.gitignore`, checked with `git check-ignore`.

## Where things are

| File | What changed |
| --- | --- |
| `next.config.mjs` | `images.remotePatterns` with the one pinned Wikimedia folder |
| `lib/dish-photos.js` | Real photo size, `sizes` for cards, `src` and alt text for every dish photo (client-safe) |
| `app/page.js` | Remote hero with `preload` and the photo credit, plus card photos |
| `app/menu/DishList.jsx`, `app/menu/[id]/page.js` | Dish photos in place of emoji |
| `app/layout.js` | `next/font` Outfit, and confetti through `next/script` `lazyOnload` |
| `app/globals.css` | `@import` removed, `--font-primary` uses `var(--font-outfit)`, `.dish-photo`, `.hero-image`, `.hero-credit` |
| `app/AddToCartButton.jsx` | `window.confetti?.()` on click |
| `.env.example`, `README.md` | Every variable explained, plus setup for a fresh clone |

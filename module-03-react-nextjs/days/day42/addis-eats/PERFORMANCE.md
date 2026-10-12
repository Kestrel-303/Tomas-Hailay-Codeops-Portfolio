# Performance in Addis Eats (Day 40)

Day 40 measures first, then makes one change at a time and measures again after each one.

## The starting point

Day 39 had no images, no font `<link>` and no third-party script, so exercises 2–5 had nothing to work on. Day 40 first adds them the way they often arrive in a real app:

- **Photos:** a 2400×1200 hero on `/home`, plus a 1200×900 photo per dish on the home cards, the menu cards and each dish page. All are plain `<img>` with no dimensions.
  - They live in `public/images/`. They're generated stand-ins (gradient + grain + the dish name), but they are real JPEGs with real weight: 665 KB for the hero, ~270 KB per dish.
- **Font:** the heading font (Fraunces) loaded with a Google Fonts `<link>` in `<head>`.
- **Third-party script:** [canvas-confetti](https://github.com/catdad/canvas-confetti) from jsDelivr as a plain blocking `<script>` in `<head>`. "Add to cart" fires it.

## How it was measured

- **Tool:** Lighthouse 13 against `next build && next start`, with the user-flow API driving the installed Chrome.
- **Throttling:** mobile (412×823), slow 4G (150 ms RTT, ~1.6 Mbps down), CPU 4× slower, applied for real (DevTools throttling).
- **LCP, CLS, TBT, page weight:** a cold navigation to `/home`. The LCP element was the hero image in every round.
- **INP:** Lighthouse only reports INP for real interactions, so a timespan clicks "Add … to cart" on `/menu/doro-wot`.
- **Dish LCP:** a navigation to `/menu/doro-wot`.
- **Runs:** 5 per step, reporting the **median**. Each build was followed by a 60 s pause before measuring.

The pause matters. My first pass measured straight after `next build`, while the machine was still busy. That inflated TBT to 1,200–1,900 ms and made one step look 0.8 s *slower* when it wasn't. Every number below comes from the second, consistent pass.

## Results

| Step | Perf | LCP | CLS | INP | TBT | Page weight | Dish LCP |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1. Baseline | 65 | **10.52 s** | 0 | 105 ms | 279 ms | 1,702 KB | 1.53 s |
| 2. `next/image` | 83 | **2.94 s** | 0 | 97 ms | 364 ms | 347 KB | 2.34 s |
| 3. `priority` on the hero only | 87 | **2.46 s** | 0 | 101 ms | 337 ms | 347 KB | 2.31 s |
| 4. `next/font` | 88 | **2.25 s** | 0 | 118 ms | 374 ms | 323 KB | 1.77 s |
| 5. `next/script` `lazyOnload` | 89 | **2.21 s** | 0 | 125 ms | 333 ms | 323 KB | 1.75 s |

**Overall: LCP 10.52 s → 2.21 s, page weight 1,702 KB → 323 KB, Lighthouse performance score 65 → 89.**

## What each change did

**2. `<img>` → `next/image`: LCP −7.6 s, −1,355 KB.**
- **What changed:** every image now has its real `width`/`height` and a `sizes` that matches the layout:
  - hero: the content width
  - cards: follow the `minmax(220px, 1fr)` grid
  - dish page: at most 640px
- **Why it's faster:** Next serves a resized WebP, so a phone gets the 750–828 px version (7–9 KB) instead of the 665 KB, 2400 px original. Loading the hero went from 9.8 s to 0.8 s. These stand-in images compress unusually well; a real photo would be bigger, but the ratio is the point.
- **One cost:** `next/image` lazy-loads by default, so the dish page's photo (its LCP) now waits. Dish LCP went from 1.53 s to 2.34 s. The brief allows `priority` on one image only, so that photo stays lazy.

**3. `priority` on the hero only: LCP −0.49 s.**
- **What changed:** the hero is the largest above-the-fold image on `/home` and Lighthouse's LCP element, so it gets `priority`. In the HTML that becomes a `<link rel="preload" as="image">` with the same `srcset`/`sizes`, and the `<img>` loses `loading="lazy"`. Every other image is still lazy.
- **Effect:** before this, the hero appeared 0.7 s after first paint. Now LCP equals FCP, so it arrives with the first frame.

**4. Font `<link>` → `next/font`: LCP −0.26 s, −24 KB.**
- **What changed:** Fraunces is downloaded at build time and served from our own origin. The browser no longer has to fetch a CSS file from `fonts.googleapis.com` and then the font from `fonts.gstatic.com` before it can paint. The page now makes zero requests to Google.
- **CLS did not improve, because it was already 0.** In this app the font stylesheet and the blocking script held first paint back until the images' dimensions were known, so nothing shifted afterwards. `next/font` still adds a size-adjusted fallback, which protects against swap shifts as the page changes, but there was no shift here to measure.
- **A note on 4→5:** steps 1–3 and my first measurement of step 4 used a confetti URL that turned out to be a 404 (a version that isn't on cdnjs). It was identical in every one of those rounds, so the step-2 and step-3 deltas hold. Steps 4 and 5 were re-measured with the working jsDelivr file.

**5. Blocking `<script>` → `next/script` `lazyOnload`: no measurable change on a healthy network, but removes a single point of failure.**
- **Healthy network:** LCP went from 2.25 s to 2.21 s, which is within noise. The 10.8 KB script downloads alongside the CSS, so it is never the slowest thing on the critical path.
- **Slow CDN:** the gain shows when the CDN is slow. With jsDelivr delayed by 5 s (no other throttling, 3 runs):

  | | First paint |
  | --- | --- |
  | Blocking `<script>` in `<head>` | **5.36 s, 5.33 s, 5.36 s**: a blank page until the CDN answers |
  | `next/script` `lazyOnload` | **0.36 s, 0.30 s, 0.27 s** |

- **Confetti still works:** `window.confetti` is a function about 1 s after load, and the "Add to cart" button guards with `window.confetti?.()` in case it hasn't arrived yet.

**INP** stayed between 97 and 125 ms in every round. None of these changes touch what runs when "Add to cart" is clicked: update the cart, then navigate to `/cart`.

## 6. Environment files

- **`.env.example`:** committed, with `SESSION_SECRET=` empty and a comment showing how to generate a value.
- **`.gitignore`:** it used to list four specific files (`.env.local`, `.env.development.local`, `.env.test.local`, `.env.production.local`), so a new one like `.env.staging.local` would have been committed. It now uses `.env` and `.env*.local`.
- **Checked with `git check-ignore`:**

  | File | Ignored? |
  | --- | --- |
  | `.env` | ignored |
  | `.env.local` | ignored |
  | `.env.development.local` | ignored |
  | `.env.production.local` | ignored |
  | `.env.staging.local` | ignored (wasn't before) |
  | `.env.example` | **not** ignored, as intended |

## Where things are

| File | What changed |
| --- | --- |
| `lib/dishes.js` | `DISH_PHOTO` (real photo size) and `DISH_CARD_SIZES` (the card `sizes` string), shared by every dish image |
| `app/home/page.jsx` | Hero with `priority`, plus card photos |
| `app/menu/DishList.jsx`, `app/menu/[id]/page.jsx` | Dish photos |
| `app/layout.js` | `next/font` Fraunces (`--font-display`) and `next/script` confetti |
| `app/globals.css` | `.hero`, `.hero-image`, `.dish-photo`, and headings using `var(--font-display)` |
| `app/menu/[id]/AddToCartButton.jsx` | Fires `window.confetti?.()` before going to the cart |
| `.gitignore` | `.env*.local` |

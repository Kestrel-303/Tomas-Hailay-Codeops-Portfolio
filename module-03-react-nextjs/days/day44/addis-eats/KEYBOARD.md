# Day 44: The keyboard pass

The whole app was driven with **Tab, Shift+Tab, Enter, Escape and typing only**. A script pressed real keys in Chrome, with no mouse events at all. The checks ran against `next build && next start`, before and after the fixes, on these pages:
- `/home`, `/menu`, `/menu/doro-wot`, `/search`, `/cart`, `/checkout`
- `/orders`, `/orders/[id]`
- `/kitchen` and `/kitchen/reports`, signed in as staff

For every stop, the script recorded:
- whether a visible focus ring showed
- anything with a pointer cursor that the keyboard can't reach
- every control smaller than 44 × 44px at phone width (390px)

## Before → after

| Check | Before (day 43 code) | After |
|---|---|---|
| Clickable `div`/`span`s (pointer-only) | 0 on every page | 0 |
| Buttons that navigate | 1: the header's **Checkout** was a `<button>` calling `router.push` | 0. It's a `<Link>` now |
| Focus ring | Chrome's default, a 1px dark outline (hard to see on the orange buttons) | A 3px dark ring with a white gap, on every stop on every page (`:focus-visible`) |
| Dead Tab stops | 2 on `/orders/[id]`: the map markers, which do nothing | 0 (`keyboard: false`) |
| Header on a phone | Sign in/out and Checkout were pushed off-screen, so they couldn't be seen or tapped; "Orders" was cut off | A **Menu** button opens all seven as 358 × 48px rows. Escape closes it |
| Targets under 44px at 390px wide | Up to 15 per page (nav links 38px, buttons 39–43px, pills 34px, sort links 19px, "← Kitchen" 18px, map zoom 30px…) | **0** on every page (inline links in sentences are exempt) |
| Two clicks on "Place order" in the same instant | **2 orders** | **1 order** |
| Unknown dish URL | 200 (a soft 404) | 404 |

## 1. Clickable divs, and visible focus

- **No clickable divs or spans.** A search for any `onClick` on a non-control found none, and the audit found nothing with a pointer cursor that can't take focus.
- **The two wrong elements:**
  - **Header "Checkout":** a `<button>` that navigated. It's a `<Link>` now, so it shows its URL, opens in a new tab and is announced as a link.
  - **Category pills:** these claimed `role="tablist"`, which promises arrow-key tab behaviour that plain links don't have. They're a `<nav>` of links now, with `aria-current="page"` on the active one.
- **The focus ring:**
  - `:focus-visible { outline: 3px solid var(--text); outline-offset: 2px; box-shadow: 0 0 0 2px #fff }`.
  - It shows on every Tab and not on a mouse click.
  - The audit measured it on all ~150 stops: `solid 3px rgb(15, 23, 42)`, with none missing.
- **Skip link:** "Skip to main content" is now the first Tab stop on every page. It moves focus into `<main>`, past the header's nine links.
- **Duplicate header:** the layout had wrapped the NavBar's `<header>` in a second `<header>`, which made two banner landmarks. The wrapper is gone, and the sticky header now sticks for the whole page.
- **Focus after a failed submit:** checkout and sign-in disable their button while pending, which used to drop focus to `<body>` when the result arrived.
  - Checkout now moves focus to the first field with `aria-invalid="true"`. Each field is linked to its error with `aria-describedby`.
  - Sign-in moves focus back to the email field.

## 2. Every function with Tab, Enter and Escape

**A whole order, by keyboard only:**
1. `/menu`: 20 Tabs to the Doro Wot card, then **Enter** opens it.
2. Tab to **Add Doro Wot to cart**, then **Enter**.
3. 15 Tabs to the header's **Checkout**, then **Enter**.
4. Tab through name, phone and area (typed into the native select), then notes.
5. Tab to **Place order**, then **Enter**.

The other functions all work the same way:
- **Cart:** quantity buttons, Remove and Clear.
- **Orders:** Cancel order.
- **Tracking page:** the map pans with the arrow keys once focused, and the zoom buttons work with Enter.
- **Kitchen reports:** sort headers, paging, the "Daily figures" `<summary>` and the CSV export.

**What couldn't be done, and is fixed now:**
- **On a phone, signing out and Checkout were unreachable.** They sat off-screen to the right.
  - The new **Menu** button (`aria-expanded`, `aria-controls="site-menu"`) opens a panel with every link and action.
  - Following a link closes it.
  - **Escape** closes it and returns focus to the Menu button, so focus never lands on something that just disappeared.
  - Tested: opened with Enter, closed with Escape, focus back on "☰ Menu".
- **Escape elsewhere:** the phone menu is the only thing the app opens. There are no dialogs, popovers or tooltips that would need Escape.

## 3. Submit buttons disabled while pending, and one order per double tap

All three forms (checkout, cancel order, sign-in) already had `disabled={pending}`. The test showed that isn't enough:
- **Double Enter:** 1 order.
- **Touch double tap at 390px:** 1 order.
- **Two clicks in the same instant:** **2 orders.** `pending` only becomes true after React re-renders, and both submit events arrived before that.

**The fix, in two layers:**
1. **`lib/use-submit-once.js`:** an `onSubmit` handler that cancels any submit until the first one has finished. Cancelling the submit event also stops the form action. Used by checkout and cancel order.
2. **A `requestId` per checkout visit:** made in the browser after hydration and sent as a hidden field. The server keeps `requestId → order` per account, and a repeat returns the order already placed.
   - `POST /api/orders` accepts the same thing as an `Idempotency-Key` header.
   - Tested on its own, without the client guard: the same key three times, two of them at the same moment, gave **1** order. A different key gave a new one.

**After:** double Enter, a touch double tap and two clicks in the same instant each placed exactly **one** order.

## 4. Touch targets and hover

- **Targets at 390px wide:** every link, button, input, select, summary and focusable element was measured. **0** are under 44 × 44px.
  - Raised to 44px minimum: `.btn`, `.nav-link`, `.pill`, `.brand`, `.sort-link`, the back links, order-id links, `<summary>`, the pager, the demo +/− counter (44px wide too), the cart quantity buttons, and Leaflet's zoom buttons and attribution links.
  - The phone menu rows are 48px.
- **Inline links:** 4 on `/menu` are inside a sentence of text. WCAG 2.5.8 exempts those.
- **Leaflet's zoom buttons:** they stayed 30px on the first attempt, because Leaflet's stylesheet loads after ours and won the tie. The rule now includes the map's own class.
- **Nothing hides behind hover:**
  - Every `:hover` rule only changes a colour, border or small lift. None reveals content or controls.
  - There are no `title` tooltips.
  - Chart tooltips repeat values that are already printed on the bars and in the tables below.

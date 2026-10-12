# The Addis Eats Dashboard: DASHBOARD.md

`/kitchen/dashboard`, staff only. Sign in as `kitchen@addiseats.et` / `kitchen123`, then use **📊 Dashboard** on the Kitchen Order Board.

Everything below was checked in a real browser against `next build && next start`.

## A neighbourhood on every order

The brief wants revenue **by neighbourhood**, but orders only had a free-text address ("Bole Atlas, near…"), which a chart can't group reliably.

- **Checkout:** a **Neighbourhood** select, from the fixed list `NEIGHBOURHOODS` in `lib/order-schema.js`. The free-text field stays for street and landmark.
- **Validation:** `validateOrder` only accepts a neighbourhood from that list, so `POST /api/orders` and `placeOrder` both require it. The README's curl examples include `"area"`.
- **Storage:** the order keeps it as `customer.area`, and the kitchen board shows it.

## Requirements

| Requirement | How |
|---|---|
| Aggregation on the server; only summarised rows cross the boundary | `lib/dashboard.js` (`server-only`) runs inside the server page. The client chart components receive 6 rows of `{ area, revenue, orders }` and 14 rows of `{ key, label, orders, revenue }`. The order table is a server component, and only its 10 visible rows are in the HTML. |
| Charts are client leaves on a server page, each with a heading, a unit and a fixed height | `NeighbourhoodChart.jsx` and `OrdersOverTimeChart.jsx` are the only `'use client'` files. The page is a server component. Headings: "Revenue by neighbourhood, 29 Sept – 12 Oct 2026 (ETB)" and "Orders per day, … (number of orders)". `.chart-frame` is a fixed 300px. |
| Each chart has the same data in a table | An open `<details>` under each chart holds a captioned table of the exact figures, with totals |
| Tables built from `table`, `caption`, `thead` and `th scope`, not divs | All three tables: caption ✓, thead ✓, `th scope` on every header and row header ✓, **0** divs inside |
| Sorting and paging in the URL, paging with `Link` | `?sort=placed\|customer\|area\|status\|items\|total&dir=asc\|desc&page=N`. Header links sort; `<nav aria-label="Order table pages">` pages with `<Link>`s and `aria-current="page"`. Only the active column has `aria-sort`. |
| Loading, empty and error states, each demonstrable | `?state=loading` (`loading.js`, same-size skeletons, `role="status"`), `?state=empty` (or a fresh server), `?state=error` (`error.js` with **Try again**). The populated state is the normal view. |

## Check yourself

- **Does every bar chart axis start at zero?**
  - Yes. Both charts set `domain={[0, 'auto']}`, and the bar chart's lowest tick is **ETB 0** (checked in the screenshot). A bar's length means something only when it's measured from zero.
- **Can you read every chart with the colour removed?**
  - Yes, checked with Chrome's achromatopsia (no colour) emulation.
  - The bars and points carry their values as text ("ETB 33.5K" on Bole, a count on every day). The axes have units, and the table under each chart repeats every number.
  - No meaning depends on colour; there's one series per chart and no legend to match.
- **How many rows cross the network for the dashboard?**
  - **30**: 6 neighbourhood rows and 14 day rows in the page payload for the charts, and 10 order rows in the table HTML.
  - Not the ~90 orders behind them, and no phone numbers anywhere in the page.
- **Does the table survive being copied into a spreadsheet?**
  - Yes. Each value sits in its own cell, and the dashboard was checked by reading the table as a spreadsheet receives it. Copied it looks like `AE-SMV5837HC5 | 2026-10-12 15:23 | Yonas Girma | Kazanchis | delivered | 3 | 1,411`:
    - totals are plain numbers under a "Total (ETB)" header
    - times are `2026-10-12 15:23`, which a spreadsheet reads as a date-time
  - The sort arrows are drawn with CSS `::after`, and the headers have no `text-transform`, so the header row copies as "Order | Placed | … | Total (ETB)".
- **Can you link someone directly to page three sorted by total?**
  - Yes: `/kitchen/dashboard?sort=total&dir=desc&page=3`. Opened in a fresh signed-in tab, it shows "sorted by total, descending. Page 3 of 9", with page 3 marked current and `aria-sort="descending"` on Total (ETB).
- **What does a brand-new customer see on the orders page?**
  - "No orders yet", then what will appear there and when they can cancel ("When you place an order, it shows up here with its status, from placed to delivered. You can cancel it until the kitchen starts cooking."), then **Browse the Menu**.
  - That heading is now an `h2` under the page's `h1` (it was an `h3`).

## Access

- **Signed out:** a real **307** to sign-in.
- **A customer:** a real **404**.
- **How:** the check is in `app/kitchen/dashboard/layout.js`. With `loading.js` on this route, Next streams the skeleton straight away with a 200, so a check in the page itself would have answered mid-stream. The layout runs before the loading boundary.
- **Sample data:** the action that loads it checks the staff role again.

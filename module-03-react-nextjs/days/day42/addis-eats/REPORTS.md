# Reports in Addis Eats (Day 41)

`/kitchen/reports` is a staff-only page with three parts:
- **Charts:** revenue and orders per day for the last 14 days.
- **Daily table:** the same figures as a table.
- **Order table:** sortable and paged.

Sign in as `kitchen@addiseats.et` / `kitchen123`, then use the Kitchen page's **Reports** button.

Day 41 also moves every price in the app from dollars to **Ethiopian birr**:
- **Prices:** realistic ETB amounts in `lib/dishes.js`.
- **Formatting:** one formatter in `lib/money.js` for prices, totals and chart axes.
- **Saved carts:** the cart's storage key was renamed, so a cart saved with old dollar prices is dropped instead of shown with the wrong numbers.

## The exercises

| # | Exercise | Where |
| --- | --- | --- |
| 0 | Empty state first | `EmptyState` in `app/kitchen/reports/page.jsx`. It explains why the page is empty and offers **Load 14 days of sample orders**, because orders live in memory and a fresh server has none. |
| 1 | Aggregate on the server, pass only the summary | `summarizeByDay` in `lib/reports.js` runs in the server component. The chart components get 14 rows of `{ key, label, revenue, orders }`, nothing else. |
| 2 | Revenue bar chart, fixed-height box, ETB ticks | `RevenueChart.jsx`. Recharts' `ResponsiveContainer` sits in a `.chart-box` that is always 280px tall. The y-axis uses `formatETBCompact` ("ETB 7.5K"); the tooltip uses `formatETB` ("ETB 7,130"). |
| 3 | Orders-per-day line chart, heading names range and unit | `OrdersChart.jsx`, under "Orders per day · 26 Sept – 9 Oct 2026 · number of orders". The revenue heading ends "· ETB". Whole numbers only on the y-axis. |
| 4 | The same data as a table | "Daily figures as a table" under the charts: a real `<table>` with a `<caption>`, `<th scope="row">` days, right-aligned numbers and a total row. It's visible, not screen-reader-only, since exact values help everyone. |
| 5 | Order table with real markup | `OrderTable.jsx`: `<caption>` (range, sort, page), `<th scope="col">` headers, the order id as `<th scope="row">`, `<time dateTime>`, and right-aligned `tabular-nums` for items and totals. |
| 6 | Sorting via searchParams, aria-sort on the active header | `?sort=placed\|customer\|status\|items\|total&dir=asc\|desc`. The header links flip the active column and start others in their natural order (newest, biggest, A–Z). Only the active `<th>` has `aria-sort`. Unknown values fall back to the default. |
| 7 | Paging with Link, and the four states | `?page=N`, 10 rows a page, `<nav aria-label="Order table pages">` with real `<Link>`s, `aria-current="page"` on the current page, and Previous/Next as plain text at the ends. A page past the end shows the last page. The four states are below. |

## Forcing the four states

| State | How to see it | What renders |
| --- | --- | --- |
| Empty | A fresh server, or `?state=empty` | Explanation, plus the load button (or a link back when forced) |
| Loading | `?state=loading` (adds a 3 s delay) | `loading.jsx`: stat and chart skeletons the same size as the real boxes, `aria-busy`, and a `role="status"` line |
| Error | `?state=error` (throws) | `error.jsx`: "The reports couldn't be loaded", **Try again** (`reset`), and the error digest as a reference. In production the real message stays in the server log. |
| Populated | After loading the samples, or once real orders exist | Stats, both charts, the daily table and the order table |

## Things that came up

- **Access check in `layout.jsx` as well as `page.jsx`.** With `loading.jsx` in place, Next streams the skeleton at once with a 200, so `redirect()` / `notFound()` in the page ran inside the stream. Signed-out visitors and customers got **200** plus the "Loading reports" skeleton before being sent away. The layout sits above the loading boundary, so now a signed-out visitor gets a real **307** to sign-in and a customer a real **404**, both checked against `next start`. The sample-data server action checks the role again, because a server action is a public POST endpoint.
- **What reaches the browser.** Checked in the page's RSC payload: the chart props are only `{ key, label, revenue, orders }` per day, and customer phone numbers and owner ids appear nowhere. (Customer first names and areas are in the order table's server-rendered HTML, because the table shows them.)
- **Cancelled orders** are listed in the order table with their status, but left out of revenue, order counts and the charts.
- **Days are Addis Ababa days** (`Africa/Addis_Ababa`), so an order at 01:00 local time counts on the right date.
- **Charts animate in when scrolled into view**, as Recharts does by default. The boxes are fixed-height before and after, so nothing shifts.

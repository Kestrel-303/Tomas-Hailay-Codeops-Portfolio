# Day 43: live tracking, one formatter and a CSV export

Day 42's app, plus:
- a delivery map on the order page
- order status that arrives over a live stream instead of a 5-second poll
- every price and time formatted in one place
- a CSV export of the reports table

Everything below was checked in Chrome against `next build && next start`.

To try it:
1. Sign in as `abebe@example.com` / `injera123` and place an order.
2. Open it from **My orders**. It goes from placed to delivered in 90 seconds.
3. For the export, sign in as `kitchen@addiseats.et` / `kitchen123` and open **Reports**.

## 1. The map: a dynamic client component with a sized placeholder

- **`app/orders/[id]/DeliveryMap.jsx`:**
  - It's a [Leaflet](https://leafletjs.com) map with OpenStreetMap tiles.
  - Leaflet reads `window` as soon as it's imported, so it can't run on the server.
- **`OrderTracker.jsx`** loads it with `next/dynamic(() => import("./DeliveryMap"), { ssr: false, loading })`:
  - The server HTML contains the placeholder and no map: `map-placeholder` is present, `leaflet-container` is absent.
  - Leaflet is a separate chunk that is only downloaded on this page. `/orders/[id]` stays at 110 kB first-load JS.
- **The placeholder and the map share the `.map-frame` class,** which is a fixed 320px tall.
  - Measured: the placeholder is 320px, then the map is 320px, so nothing below it moves when the map arrives.
- **The map is removed on unmount** (`instance.remove()`). Without that, React's strict-mode double mount would leave a second map in the same `div`.

## 2. Two markers, fitted, and repeated in text

- **The markers:** one for the courier (🛵 Courier) and one for the delivery address (📍 You).
  - They're CSS labels (`L.divIcon`), not Leaflet's default PNG pins, whose image paths break under a bundler.
  - Each says what it is, so the map doesn't depend on colour.
  - The courier's label sits above its point and the address's below. When the courier arrives and both points are the same, the labels stack instead of one hiding the other. (The first version hid "Courier" behind "You"; seen in a screenshot and fixed.)
- **Fitting the view:** every update calls `fitBounds` on both points, with padding so the labels stay inside the frame and `maxZoom: 15` so an arrival doesn't zoom to street level.
  - Checked at three moments: at the kitchen, on the way, and delivered. Both labels were inside the frame each time.
- **The same in text:** a `<dl>` under the map says where the courier is, where it's going and when. For example: "Courier: On the way to Piassa, about 2.2 km away · Delivering to: Piassa (your delivery address) · Arrives: in under a minute (around 21:16)".
  - It's in the server HTML too, so it works before the JavaScript loads, if the tiles fail, and for screen readers.
  - The map region's label points to it.
- **Where the courier comes from:** there's no courier app yet, so `lib/tracking.js` works the position out from the same timer that moves the status.
  - **Placed / preparing:** the courier waits at the kitchen (Meskel Square).
  - **Out for delivery:** the courier moves in a straight line to the centre of the customer's neighbourhood.
  - **Delivered:** the courier is at the destination.
  - The coordinates are approximate neighbourhood centres, not addresses.

## 3. The stream: `GET /api/orders/[id]/stream`

The route returns a `ReadableStream` with `Content-Type: text/event-stream`, `Cache-Control: no-cache, no-transform` and `X-Accel-Buffering: no`, and it runs on the Node runtime with `force-dynamic`.

What it sent, read raw in the browser:

```
retry: 3000

id: 1
event: status
data: {"id":"AE-…","status":"placed","tracking":{…},"at":"2026-10-13T18:15:17.9Z",…}

```

The framing:
- Every message is `field: value` lines followed by **one blank line**.
- `retry` sets the reconnect delay.
- `id` lets a reconnecting browser send `Last-Event-ID`.
- `event` picks the listener.
- `data` is a single line of JSON.

The events:
- **`status`** when the stage changes, and **`position`** every 2 s while the courier moves.
- **`: heartbeat`** every 15 s. It's a comment line, which keeps proxies from closing a quiet stream.
- **`done`** comes after the delivered (or cancelled) snapshot. Then the server closes the stream itself.
  - In the test, the stream sent 4 `status`, 41 `position` and 1 `done` over the order's 90 seconds.

**Access is checked before a stream is opened:**
- Signed out → **401**; another customer's order → **404**. Both are JSON, not a stream.
- A non-200 response makes `EventSource` give up instead of retrying forever.

**When the tab goes away,** `request.signal`'s `abort` stops the timers, so nothing runs for a closed tab.

## 4. EventSource, seeded from the server, closed on unmount

- **`page.jsx` (server)** reads the order and passes `toTrackedOrder(order)` as `initialOrder`. The first paint has the real status, map positions and text before any connection exists.
- **`OrderTracker.jsx`** opens `new EventSource(...)` in an effect and calls `setOrder` on each `status` and `position` event.
- **Unmount:** the effect's cleanup closes the stream.
  - Checked by opening an order and clicking **← All orders** (a client-side navigation): EventSource closed went from 0 to 1.
- **A finished order opens no stream at all.** Revisiting a delivered order: EventSource opened 0.
- **One clock:** each snapshot carries the server's time (`at`). "Placed 13 Oct, 21:15, 3 minutes ago" is measured from that, so the server HTML and the hydrated page print the same words. There were no hydration warnings.

## 5. The connection indicator, and closing on delivery

- **The indicator** is a dot plus words in a `role="status"` line, so changes are announced and the colour only repeats the text. Its states:
  - **Connecting to live updates…** (grey)
  - **Live: updates arrive as they happen** (green, pulsing unless reduced motion is on)
  - **Connection lost, reconnecting…** (orange). This is `readyState` CONNECTING after an error, when the browser retries on its own.
  - **Live updates unavailable. Reload the page to try again.** (red). This is `readyState` CLOSED: the browser gave up, for example on a 401 or 404.
  - **Updates finished: this order won't change again** (grey)
- **Closing on delivery:**
  - On `done`, the client calls `source.close()` itself.
  - That matters because when a server ends a stream, `EventSource` treats it as a dropped connection and reconnects after `retry` ms, indefinitely.
  - Checked: 8 seconds after delivery, EventSource had still opened only once, and the indicator read "Updates finished".

## 6. `lib/format.js`: `etb`, `when` and `relative`

- **`etb(1235)`** → "ETB 1,235". **`etb(12300, { compact: true })`** → "ETB 12.3K" for chart ticks.
- **`when(date)`** → "13 Oct, 14:05". It is always Addis Ababa time, whatever the server's or the browser's own zone. The styles:
  - `"time"` → "14:05"
  - `"day"` → "13 Oct"
  - `"day-year"` → "13 Oct 2026"
  - `"day-key"` → "2026-10-13", for grouping by day
  - `"sortable"` → "2026-10-13 14:05", for CSV
- **`relative(date, now)`** → "3 minutes ago", "in 5 minutes", "just now", "in under a minute", "yesterday".
  - `now` is passed in, so a server render and the client agree.

Where it's used:
- `lib/money.js` is gone, and every price and total in the app goes through `etb()`.
- `lib/reports.js` dropped its own four `Intl.DateTimeFormat`s and uses `when()`.
- The kitchen board and the order page print `when()` + `relative()` instead of `toLocaleTimeString()`, which used the server's zone.
- `grep` finds no `toLocale…` or `new Intl` outside `lib/format.js`.
- Tested in `lib/format.test.mjs`. `npm test` runs it, along with the CSV tests.

## 7. CSV export, tested with awkward values

- **The button:** **Export CSV (N orders)** next to the reports table's heading.
  - It's a plain `<a download>` to `GET /kitchen/reports/orders.csv?sort=…&dir=…`.
  - The file holds every order in the 14 days, not just the current page, in the table's current sort order.
- **The route checks the staff role itself,** because route handlers don't run the reports layout. Signed out → **401**; a customer → **404**.
- **`lib/csv.js`** follows RFC 4180:
  - Commas between fields, and CRLF line endings.
  - Any field containing a comma, a quote or a line break is wrapped in quotes, with inner quotes doubled.
  - A UTF-8 byte-order mark (`EF BB BF`, confirmed in the response bytes) makes Excel read "×" correctly.
  - Text cells starting with `=`, `+`, `-` or `@` get a leading `'`, so a spreadsheet can't run them as formulas.

**The awkward-values test.** I placed an order as `Abebe "Abe" Bikila` with delivery notes `Gate 2, blue door`, then downloaded the export. The row came back as:

```
AE-1791915515257-105,2026-10-13 21:18,"Abebe ""Abe"" Bikila",Piassa,"Gate 2, blue door",delivered,"Doro Wot × 2, Shiro × 1",3,1160
```

- **Read back by a separate RFC 4180 parser:** every row has exactly 9 cells, and the cells are `Abebe "Abe" Bikila` and `Gate 2, blue door`, exactly as typed.
- **The item list contains commas too,** and it also stays in one cell.
- **`lib/csv.test.mjs`** checks the same cases, plus a line break and a formula, without a server.

## Limits

- **The courier is simulated:** a straight line between approximate points, on a demo timer. Real tracking would need a courier app sending positions.
- **The stream checks the session once, when it opens.** Signing out in another tab doesn't end a stream that's already open; it ends at delivery or when the tab closes.
- **Orders are still in memory,** so the stream only works against the server instance that holds the order.
  - On a serverless host, streams also count against the function's time limit. This one lasts at most about 90 s per order.
- **Map tiles come from OpenStreetMap's public tile server,** which is fine for a class demo. A real app should use a tile provider with an agreement.

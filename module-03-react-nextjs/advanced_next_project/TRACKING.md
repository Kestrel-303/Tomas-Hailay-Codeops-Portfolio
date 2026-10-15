# Tracking a Delivery: TRACKING.md

The tracking page at `/orders/[id]` now has:
- a Leaflet map of the courier and the delivery address
- the same details written out beside the map
- a live status over Server-Sent Events, starting from the server's render

Every price and time in the app now goes through `lib/format.js`. The order history downloads as a CSV that survives awkward data.

Everything below was checked in Chrome on `next build && next start`.

**To try it:**
1. Sign in as `abebe@example.com` / `injera123` and place an order.
2. Open **My Orders → Track →**. The order goes from placed to delivered in 90 seconds.
3. The CSV is the **⬇ Export order history** button on **My Orders**.

## The requirements

| Requirement | Where and how |
|---|---|
| Map loaded with `ssr: false`, stylesheet imported, explicit height, attribution kept | `OrderTracker.jsx` loads `DeliveryMap.jsx` with `next/dynamic(..., { ssr: false })`. `DeliveryMap.jsx` imports `leaflet/dist/leaflet.css`. The placeholder and the map share `.tracking-map { height: 360px }`. The tile layer's `attribution` ("© OpenStreetMap contributors") stays in the corner. |
| The same delivery information as text beside the map | `.tracking-text`: a "Where is my order?" heading, one sentence, then delivering to, expected, placed and last update. It sits to the right of the map, and below it under 760px. |
| A stream route handler using `data: ` and two newlines | `app/api/orders/[id]/stream/route.js`. Every message is `id: …\nevent: …\ndata: {json}\n\n`. |
| An EventSource seeded from server data, closed on unmount, with a visible state | `page.js` passes `toTrackedOrder(order)` as `initialOrder`. The `useEffect` opens the `EventSource` and returns `() => source.close()`. A `role="status"` line shows Connecting / Live / Reconnecting / Stopped / Finished. |
| `lib/format.js` exporting `etb`, `when` and `relative`, each built once | Every `Intl.NumberFormat`, `Intl.DateTimeFormat` and `Intl.RelativeTimeFormat` is created once at module level and reused. No call builds a new one. |
| CSV export that correctly quotes commas, quotes and newlines | `lib/csv.js` (RFC 4180) and `app/orders/export.csv/route.js`, tested in `lib/csv.test.mjs` and on a real download (below). |

## How it works

**The map** (`DeliveryMap.jsx`):
- **Created once, removed on unmount** (`map.remove()`), so strict mode can't leave two maps in one `div`.
- **The markers** are text labels, **🛵 Courier** and **🏠 You**, not Leaflet's default PNG pins. Those pin images break under a bundler, and the text means the markers don't depend on colour.
  - The courier's label sits above its point and the home's below, so they stack instead of covering each other on arrival.
- **Every update** moves both markers and calls `fitBounds` with `padding: [50, 50]` and `maxZoom: 15`.
  - Checked at three moments (placed, moving, delivered): both labels were inside the map each time.

**The courier** (`lib/tracking.js`): there's no courier app, so the position comes from the order's own timer.
- **Placed / preparing:** at the kitchen (Meskel Square).
- **Out for delivery:** on a straight line to the centre of the customer's neighbourhood.
- **Delivered:** at the neighbourhood.
- The neighbourhood is a rough centre point, never the typed address.
- The same file writes the sentence for the text panel, e.g. "Your courier is on the way to Bole, about 2.7 km from you (23% of the trip done)."

**The stream** (`GET /api/orders/[id]/stream`):
- **Headers:** `text/event-stream; charset=utf-8`, `Cache-Control: no-cache, no-transform`, `X-Accel-Buffering: no`, on the Node runtime with `force-dynamic`.
- **The first bytes, read raw in the browser:**

```
retry: 3000

id: 1
event: status
data: {"id":"AE-MV72T80H-737","customer":{"name":"Abebe \"Abe\" Bikila",…},"status":"placed","tracking":{…},"at":"…"}

```

- **Why two newlines:** the first newline ends the `data:` line, and the second (an empty line) ends the message. With only one, the browser never fires the event. The test checked that every message ends in `\n\n`.
- **The events:**
  - **`status`:** the stage changed.
  - **`position`:** sent every 2 s while the courier moves.
  - **A `: keep-alive` comment** every 15 s.
  - **`done`:** after the delivered (or cancelled) snapshot. Then the server closes the stream.
- **Access:** signed out → **401**; another customer's order → **404**. Both are JSON, sent before any stream opens, which also stops `EventSource` from retrying.

**The client** (`OrderTracker.jsx`):
- Starts from the server's snapshot. Each snapshot carries the server's time (`at`), so "Placed 13 Oct, 22:32 (1 minute ago)" is the same in the HTML and after hydration.
- On `done`, it calls `source.close()` itself. Otherwise `EventSource` would treat the server's close as a dropped connection and reconnect every 3 s, indefinitely.
- An order that's already finished never opens a stream at all.
- **The connection states:**
  - **Live:** after `onopen`.
  - **Reconnecting:** an error while `readyState` is CONNECTING, so the browser is retrying.
  - **Stopped:** `readyState` is CLOSED, e.g. after a 401.
  - **Finished:** after `done`.
- The old 5-second SWR poll is gone, and with it `useOrder`, `orderKey` and the separate `OrderStatusBadge` (the badge is part of the tracker now).

**`lib/format.js`:**

| Call | Prints |
|---|---|
| `etb(450)` | `ETB 450` |
| `etb(12300, { compact: true })` | `ETB 12.3K` (chart ticks and bar labels) |
| `etb(1687, { unit: false })` | `1,687` (cells under a "(ETB)" header, which paste into a spreadsheet as numbers) |
| `when(date)` | `13 Oct, 22:32`. Other styles: `'time'`, `'day'`, `'day-year'`, `'day-key'` (`2026-10-13`), `'sheet'` (`2026-10-13 22:32`) |
| `relative(date, now)` | `2 minutes ago`, `in under a minute`, `yesterday` |

What it replaced:
- **`lib/money.js`:** deleted.
- **Every dish's `priceFormatted: '450 ETB'`.**
- **The hand-written `` `${total} ETB` ``** on cart, checkout, orders, kitchen and the tracker.
- **The dashboard's four `Intl.DateTimeFormat`s.**
- **`toLocaleTimeString()`,** which printed the server's time zone, not Addis Ababa's.

Page titles, `og:image:alt` and the preview card use it too: "Special Kitfo · ETB 480 · Addis Eats". The preview image still renders (200, PNG).

## Check yourself

**Does the build succeed, and does the page avoid jumping when the map appears?**
- Yes. `next build` finishes with no errors or warnings.
- The placeholder measured **360px** tall, and the map that replaced it **360px**.
- The whole page's cumulative layout shift, measured with a `PerformanceObserver` from the first byte, was **0.0025** ("good" is under 0.1).
- The Leaflet stylesheet was confirmed loaded, by finding its `.leaflet-pane` rule in the page's stylesheets.

**Navigate away from the tracking page five times: how many connections are open?**
- **None.** I went My Orders → Track → ← My Orders five times, with client-side navigation (the case where a missing cleanup leaks).
- **Chrome's network log:** 5 `EventSource` requests made, **0** still open afterwards.
- **The server's own count**, logged on every open and close:

```
[stream] AE-MV72V6BW-787 opened; open streams: 1
[stream] AE-MV72V6BW-787 closed (browser left); open streams: 0
… the same pair five times …
[stream] AE-MV72V6BW-787 opened; open streams: 1
[stream] AE-MV72V6BW-787 closed (delivered); open streams: 0
```

- That last pair is the delivery: the server closed the stream on purpose. 8 seconds later there were **0** new requests (no reconnect), and the indicator read "Finished: this order won't change again".

**Is every price and time going through the shared format module?**
- Yes. A search of `app/` and `lib/` finds no `toLocale…`, `new Intl`, `priceFormatted`, `formatETB` or hand-built `` `… ETB` `` outside `lib/format.js`.
- **What the pages printed:**
  - Menu: "ETB 450".
  - My Orders: "13 Oct, 22:30 (1 minute ago)".
  - Kitchen board: "22:32, 2 minutes ago".
  - Dashboard: "ETB 3,374", bar labels "ETB 3.4K", and table cells "1,687" under "Total (ETB)".
- `lib/format.test.mjs` pins the outputs, including Addis Ababa time on a machine in another zone.

**Does the CSV survive a value containing a comma and a quotation mark?**
- Yes, and a line break too. I placed an order with:
  - name **`Abebe "Abe" Bikila`**
  - address **`Bole Road, near Edna Mall, "blue gate"`**, then a new line, then **`2nd floor`**
- The downloaded file:

```
Order,Placed (Addis Ababa time),Status,Name,Neighbourhood,"Street, building or landmark",Payment,Dishes,Subtotal (ETB),Delivery (ETB),VAT (ETB),Total (ETB)
AE-MV72T80H-737,2026-10-13 22:30,out-for-delivery,"Abebe ""Abe"" Bikila",Bole,"Bole Road, near Edna Mall, ""blue gate""
2nd floor",cash,"Doro Wat (Traditional Chicken Stew) × 2, Special Kitfo × 1",1380,100,207,1687
```

- **Read back by a separate RFC 4180 parser:**
  - 2 rows (the header and the order), each with **12 cells**.
  - The name and the address came back **exactly as typed**, newline included.
  - The header "Street, building or landmark" has a comma too, and it's quoted. So is the dish list.
- **The file itself:**
  - It starts with a UTF-8 byte-order mark (`EF BB BF`, so Excel shows "×").
  - It's sent as `text/csv; charset=utf-8` with `Content-Disposition: attachment`.
- **Access:** it holds only the signed-in customer's orders. Another customer's export didn't contain this order, and signed out, `proxy.js` redirects to sign-in.
- **Formula protection:** text cells starting with `=`, `+`, `-` or `@` get a leading `'`, so a spreadsheet can't run them.

**Can someone who cannot see the map still find where their order is?**
- Yes:
  - The map is a labelled region: "Map of the courier and your delivery address. The same details are written out next to it."
  - Next to it is the heading **"Where is my order?"**, then a sentence and the details.
  - In Chrome's accessibility tree (what a screen reader reads), that comes out as: heading "Where is my order?", then "Your courier is on the way to Bole, about 1.5 km from you (58% of the trip done).", then Delivering to, Expected and Placed.
- **Change announcements:** the sentence is an `aria-live="polite"` region and the connection line is `role="status"`, so changes are announced without moving focus.
- **No JavaScript needed:** the text is in the server HTML. Without JavaScript the page reads "Your order is at the Addis Eats kitchen at Meskel Square, about 3.5 km from you…" before the map's code has loaded.

## Limits

- **The courier is simulated:** a straight line on the demo timer, between rough neighbourhood centres.
- **The session is checked when a stream opens.** Signing out in another tab doesn't end a stream that's already open; it ends at delivery or when the page closes.
- **Orders are still in memory.** A stream only works on the server instance that holds the order.
  - On serverless hosting, each stream also counts against the function's time limit (about 90 s here).
- **The tiles come from OpenStreetMap's public tile server,** fine for a class project. Production needs a tile provider.

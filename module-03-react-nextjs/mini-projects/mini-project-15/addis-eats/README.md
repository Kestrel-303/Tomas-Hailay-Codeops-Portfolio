# Securing Addis Eats

Mini-project 15 builds on mini-project 14. It adds:

- sign-in and sign-out
- a signed, `httpOnly` / `secure` / `sameSite` session cookie, with one `getSession()` helper
- `proxy.js` guarding `/checkout`, `/orders` and `/kitchen`, and remembering where you were going in `next`
- ownership checks inside every action that writes
- a staff-only `/kitchen` order board

`/orders` is now **My Orders**, scoped to the signed-in account. The old public kitchen board moved to `/kitchen`.

Every protected route, its layers, what each layer proves, and the three attacks run against the app are in **[AUTH.md](./AUTH.md)**.

Sign in with `abebe@example.com` / `injera123`, `tirunesh@example.com` / `injera123`, or `kitchen@addiseats.et` / `kitchen123` (staff). `npm test` checks the `next` validator against crafted links.

> Next 16 renamed `middleware.js` to `proxy.js` (same API, Node runtime), so the "middleware" in the brief is `proxy.js` here.

---

# Live Data in Addis Eats (mini-project 14)

Mini-project 14 builds on mini-project 13 (the API and server actions). It adds the three client-side data problems, solved with [SWR](https://swr.vercel.app):

- **`/orders/[id]`**: an order-status page rendered on the server, then polled every 5 seconds.
- **`/menu` search**: a search box that debounces and never shows results for the wrong term.
- **`/menu` paging**: a paged dish list that doesn't flash, with the page number in the URL.

Every query, its key, its refresh rule and the reasoning are in **[DATA.md](./DATA.md)**.

## What the network tab shows while typing

Open DevTools → Network, filter to `Fetch/XHR`, and type `kitfo` quickly into the menu search box:

- **One** request, `api/dishes/search?q=kitfo`, about 300ms after the last keystroke. There aren't five: the SWR key is built from the debounced term, so keystrokes in between never become requests.
- Type slowly (`k`, pause, `ki`, pause …) and each pause is its own request. They can come back **out of order**, because the route adds random 200–1000ms latency on purpose. The list still only ever shows results for what's in the box, and the "N results for “…”" label comes from the response itself.
- Clear the box and **nothing** is sent. An empty term is a `null` key, and the paged menu comes back from the cache.
- Retype a term you searched within the last minute and nothing is sent. It's served from the cache (`dedupingInterval` 60s).
- Click **Next →** and you get one `api/menu?page=2` request, and **no** `menu?_rsc=…` request, because paging uses `history.pushState`. The current dishes stay on screen, dimmed, until page 2 arrives. Click **← Previous** and page 1 appears instantly from the cache.

On `/orders/<id>` (use **Track This Order** after checkout):

- **No** `api/orders/…` request on load, because the server sent the order as `fallbackData`. Then one request every 5s. That's one, not two, even though two components (the heading badge and the tracker) read that key.
- Once the status reaches **Delivered** (about 90s after ordering) or **Cancelled**, the requests stop.

## Check yourself

- **Does typing five characters fire one request or five?** One, 300ms after the last keystroke.
- **Does the order page show data immediately, with no spinner?** Yes. The status is in the server-rendered HTML, and SWR starts from that `fallbackData`.
- **Do two components asking for the same key produce one network call?** Yes. `OrderStatusBadge` and `OrderTracker` both call `useOrder(id)`, and the network tab shows one request per poll.
- **Does the list keep previous results visible while the next load runs?** Yes. `keepPreviousData: true` on both the menu page and the search queries, and the old list is dimmed rather than removed.
- **Can you justify every `refreshInterval` and `staleTime` in one sentence?** Yes, see the table in [DATA.md](./DATA.md). In SWR, `staleTime` is `dedupingInterval`.

## Running locally

```bash
npm install
cp .env.example .env.local   # then put a real value in SESSION_SECRET
npm run dev
```

Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

## Error shape

Every error — from a route handler or a server action — has the same shape:

```json
{ "error": { "code": "VALIDATION_FAILED", "message": "Please correct the highlighted fields.", "fieldErrors": { "phone": "..." } } }
```

`fieldErrors` is only present on validation failures.

## Route handlers

| Endpoint | Method | Status codes |
|---|---|---|
| `/api/dishes` | `GET` | **200** — array of every dish |
| `/api/dishes/[id]` | `GET` | **200** — the dish · **404** `NOT_FOUND` — unknown id (never an empty 200) |
| `/api/dishes/search?q=` | `GET` | **200** — `{ q, items, total }`, random 200–1000ms latency on purpose |
| `/api/menu?category=&page=` | `GET` | **200** — `{ category, items, page, totalPages, total }`, 4 per page, out-of-range pages clamped |
| `/api/orders/[id]` | `GET` | **200** — your order · **401** `UNAUTHORIZED` — no valid session · **404** `NOT_FOUND` — unknown, or someone else's |
| `/api/orders` | `POST` | **201** — the created order · **401** `UNAUTHORIZED` — not signed in · **400** `BAD_REQUEST` — body isn't JSON · **422** `VALIDATION_FAILED` — with `fieldErrors` |

Any other method on these paths gets Next's **405 Method Not Allowed**.

### `POST /api/orders` body

```json
{
  "name": "Abebe Bikila",
  "phone": "0911234567",
  "address": "Bole Atlas, near Medhanealem Church",
  "paymentMethod": "telebirr",
  "items": [{ "id": "kitfo", "qty": 2 }]
}
```

- `phone`: Ethiopian mobile, `09XXXXXXXX` or `+2519XXXXXXXX` (spaces/dashes ignored)
- `paymentMethod`: `telebirr` · `cbe` · `cash`
- `items`: dish ids from the menu, `qty` 1–20. Names and prices are taken from the
  server's menu; any `price` the client sends is ignored. Totals use the same
  delivery fee (100 ETB) and VAT (15%) as the cart page.

### Try it with curl

The order endpoints need a signed-in `ae_session` cookie now (copy it from DevTools → Application → Cookies and add `-b "ae_session=…"`). Without it they return `401`.

```bash
curl -i localhost:3000/api/dishes
curl -i localhost:3000/api/dishes/kitfo
curl -i localhost:3000/api/dishes/burger          # 404

# 422 with named field errors
curl -i -X POST localhost:3000/api/orders -H "Content-Type: application/json" \
  -d '{"name":"Abebe","phone":"12345","address":"Bole Atlas","paymentMethod":"cash","items":[{"id":"kitfo","qty":1}]}'

# 201
curl -i -X POST localhost:3000/api/orders -H "Content-Type: application/json" \
  -d '{"name":"Abebe","phone":"0911234567","address":"Bole Atlas","paymentMethod":"cash","items":[{"id":"kitfo","qty":1}]}'
```

## Server actions (`app/orders/actions.js`)

Server actions are POST endpoints too, but can't set an HTTP status, so each returns a
`status` field with the same meaning, and the UI branches on it.

| Action | Used by | `status` values |
|---|---|---|
| `placeOrder(prevState, formData)` | Checkout form via `useActionState` | **201** created · **422** with `fieldErrors` (and the submitted `values`, so the form refills) |
| `cancelOrder(prevState, formData)` | "Cancel order" button on `/orders` via `useActionState` | **200** cancelled · **401** no valid session · **403** not your order · **404** unknown order · **409** already cancelled, or the kitchen has already started (`TOO_LATE`) |

Both call `revalidatePath('/orders')` after a successful write (so does `POST /api/orders`).

## How the pieces fit

| File | Role |
|---|---|
| `lib/order-schema.js` | **The one schema.** `validateOrder()` is used by `POST /api/orders` and `placeOrder`; `PAYMENT_METHODS` is used by the form. |
| `lib/api-errors.js` | Builds the shared error shape. |
| `lib/pricing.js` | Subtotal / delivery / VAT, shared by the cart page and the order store. |
| `lib/orders.js` | In-memory order store (`server-only`). Lost on restart. Orders move `placed → preparing → out-for-delivery → delivered` on a timer (15s / 45s / 90s). |
| `lib/fetcher.js` | The shared SWR fetcher. Throws on non-OK responses. |
| `lib/query-keys.js` | Builds every SWR key. Used by both server (fallback) and client. |
| `lib/queries.js` | Every SWR hook and its refresh rules (`useOrder`, `useMenuPage`, `useDishSearch`). |
| `lib/session.js` | The one session helper: signs, verifies, sets and revokes the `ae_session` cookie (`server-only`). The only place `SESSION_SECRET` is read. |
| `app/checkout/CheckoutForm.jsx` | `<form action={formAction}>` — no `fetch`, `pending` from `useActionState` drives the button. |
| `app/orders/page.js` | My Orders: dynamic, lists only `getOrdersByOwner(session.id)`. |
| `app/kitchen/page.js` | Staff-only order board (every order, with contact details). Role checked on the server. |

## Check yourself

- **Invalid phone with `curl -X POST` →** `422` with `fieldErrors.phone`.
- **Valid order →** `201`. **Unknown dish id →** `GET /api/dishes/burger` is `404 NOT_FOUND`, not an empty `200`
  (and an order containing `burger` is a `422` with `fieldErrors.items`).
- **Field errors after switching to the server action?** Yes — `placeOrder` returns
  `fieldErrors` plus the submitted `values`; the form shows the errors under each field
  and refills the inputs.
- **New order on the cached orders page?** `/orders` is prerendered and served with
  `x-nextjs-cache: HIT`. `revalidatePath('/orders')` after each write marks it stale,
  so the next request re-renders and the new order (or cancellation) shows immediately.
- **`cancelOrder` with someone else's id from the console?** The action re-checks
  everything on the server, regardless of which buttons the UI showed:
  - no cookie, or a hand-edited cookie (the HMAC signature fails) → `401 UNAUTHORIZED`
  - a valid session that isn't the order's owner → `403 FORBIDDEN`, nothing is written
  - the owner → `200`, then `409 ALREADY_CANCELLED` on a repeat
- **Any secret in the browser's JavaScript?** No. `SESSION_SECRET` lives only in
  `.env.local` (git-ignored), has no `NEXT_PUBLIC_` prefix, and is read only in
  `lib/session.js`, which imports `server-only` (importing it from a client component
  is a build error). Grepping `.next/static` for the secret's value finds nothing. The
  session cookie is `httpOnly`, so page scripts can't read it either.

See [BOUNDARY.md](./BOUNDARY.md) for the server/client component map.

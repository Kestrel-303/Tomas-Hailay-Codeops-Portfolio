# Data in Addis Eats

Server components read the data for every first paint. SWR takes over in the browser only where data must stay fresh or react to typing.

## Server reads

These run inside server components, route handlers and server actions. None of them is a client query, and none ships its raw data to the browser beyond what the page renders.

| Read | Where | When it runs | Scoped by |
|---|---|---|---|
| `getAllDishes()` / `getDishById(id)` | `/`, `/menu/[id]`, `generateMetadata`, `opengraph-image`, `sitemap.js` | Build time (static and SSG pages) | Public data |
| `getMenuPage(category, page)` | `/menu` (then seeds SWR, below) | Per request, cached by ISR for 60s | Public data |
| `getOrdersByOwner(session.id)` | `/orders` | Every request (reads the session cookie) | The id inside the **verified cookie**, never a URL or form value |
| `getOrderById(id)` + `ownerId === session.id` | `/orders/[id]` (then seeds SWR, below), `GET /api/orders/[id]`, `cancelOrder` | Every request | Ownership check. Someone else's order looks exactly like a missing one (404). |
| `getAllOrders()` | `/kitchen` | Every request | Staff role, checked on the server |

## Client queries (SWR)

Every client query lives in `lib/queries.js`, except the header's session check (last row below). Every key is built in `lib/query-keys.js`.

Every request goes through the one fetcher in `lib/fetcher.js`, registered globally with `<SWRConfig value={{ fetcher }}>` in `app/Providers.jsx`. The fetcher throws on any non-OK response, with `status` and our API's error `code` attached, so a 401 or 404 reaches SWR as an `error` and not as "data".

| Query (hook) | Used by | Key | Refresh rule | Why |
|---|---|---|---|---|
| `useOrder(id, fallbackData)` | `app/orders/[id]/OrderTracker.jsx` and `OrderStatusBadge.jsx` | `/api/orders/<id>` | `refreshInterval` 5s while the status is `placed`, `preparing` or `out-for-delivery`, then `0` (stop) once it is `delivered` or `cancelled`. `dedupingInterval` is the SWR default of 2s. Revalidates on focus. | The status changes on its own within seconds, so it has to be polled. 5s is quick enough to feel live and slow enough to be cheap, and a final status can never change again, so polling it would be wasted requests. |
| `useMenuPage(category, page)` | `app/menu/MenuBrowser.jsx` (paged list) | `/api/menu?category=<c>&page=<n>` (`category` left out for All) | `dedupingInterval` 60s, `revalidateOnFocus: false`, `keepPreviousData: true`, no polling. | The menu only changes on deploy or the 60s ISR window, so a page fetched in the last minute is trusted, and flicking back to it costs no request. |
| `useDishSearch(term)` | `app/menu/MenuBrowser.jsx` (search box) | `/api/dishes/search?q=<term>`, or **`null`** when the debounced term is empty | `dedupingInterval` 60s, `revalidateOnFocus: false`, `keepPreviousData: true`, no polling. | Same data as the menu, so the same 60s freshness. A null key means an empty box sends nothing. |
| `useSWR('/api/session')` | `app/AuthNav.jsx` (header: Sign In / My Orders / Kitchen / Sign Out) | `/api/session` | SWR defaults, plus a `mutate()` on every route change. | Reading cookies in the root layout would make *every* page render per request, including the static home and dish pages. So the header asks the API instead, and re-checks after each navigation, since sign-in and sign-out both end in a redirect. It's for display only: every page, action and handler checks `getSession()` itself (see AUTH.md). |

### About `staleTime`

`staleTime` is the TanStack Query name. SWR's equivalent is `dedupingInterval`: a repeat request for the same key inside that window is answered from the cache, with no network call.

- **Order: 2s (the default).** Two components on the status page ask for the same key at the same time. 2s is enough to fold them into one request, and it stays well under the 5s poll, so no real update is ever skipped.
- **Menu and search: 60s.** Matches the `/menu` page's `revalidate = 60`. The data can't change faster than that, so neither should the cache.

## Where the first paint comes from

| Screen | First paint | How SWR gets it |
|---|---|---|
| `/orders/[id]` | Server component reads the order from the store (owner-checked via the signed session cookie). | `fallbackData` on both hooks, so there's no spinner and no request on mount. Polling starts 5s later. |
| `/menu?category=…&page=…` | Server component renders the page the URL asks for. | `<SWRConfig value={{ fallback: { [key]: data } }}>`. This is keyed, so the server's page 1 can never stand in for page 2 while page 2 is loading. Plain `fallbackData` would do exactly that. |
| Search results | Nothing (the box starts empty). | Null key until the user types. |

## The three problems, and what solves each

**Order status that's server-rendered, then polls.** `OrderTracker` has no `useEffect` and no `useState`. It is one `useOrder()` call. The badge in the page heading calls the same hook with the same key, and SWR shares the cache entry and dedupes, so the page still makes one request per poll.

**Search that debounces and never shows the wrong results.**
- `useDebouncedValue(term, 300)`: the key only changes 300ms after the last keystroke, so typing "kitfo" fires one request, not five.
- The search API has random 200–1000ms latency, so responses can arrive out of order. That's harmless: SWR stores each response under its own key, and the component only reads the key for the *current* debounced term. A late "kit" response lands in the "kit" cache entry and is never shown under "kitfo".
- The heading is built from `q` *in the response*, so the "N results for …" label always matches the list under it, even while newer results are loading.
- While the next term is loading (or the user is still typing) the old list stays visible but dimmed, with "updating…" shown.

**Paged list that doesn't flash.**
- `keepPreviousData: true`: on Next, page 1 stays on screen (dimmed) until page 2 arrives, instead of `data` dropping to `undefined`.
- The page number is in the query string (`/menu?category=Tibs&page=2`), so a page can be linked and shared. The server renders that exact page for a direct visit.
- Paging uses `window.history.pushState`. Next syncs `useSearchParams` with it, and unlike `router.push` it doesn't fetch an RSC payload, so only `/api/menu` calls appear. Back/Forward step through pages, and pages already seen come from the cache.
- One catch: `keepPreviousData` also returns old search data when the key becomes `null`. `MenuBrowser` decides what to render from the debounced term, not from `data`, so clearing the box goes straight back to the paged menu.

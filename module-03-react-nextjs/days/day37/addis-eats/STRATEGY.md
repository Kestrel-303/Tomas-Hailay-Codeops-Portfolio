# Rendering Strategy

This is what each route is supposed to do, so the build output can be checked against it.

| Route | Strategy | Marker |
| --- | --- | --- |
| `/` | Static | `○` |
| `/home` | Static | `○` |
| `/cart` | Static | `○` |
| `/checkout` | Dynamic (reads cookies) | `ƒ` |
| `/menu` | Static + ISR, revalidate 60s | `○` with `1m` revalidate |
| `/menu/[id]` | Static, pre-built per dish (`generateStaticParams`) | `●` |

## Why each revalidate window

- `/menu` revalidate = 60s: the dish list is edited occasionally (price/name tweaks), so a short window lets changes show up within a minute without a full redeploy, while still serving a cached page for nearly every request.
- `/menu/[id]` has no revalidate export: each dish page is pre-built once from `generateStaticParams` and only changes when the app is redeployed, so there is nothing to revalidate on a timer.
- `/checkout` has no revalidate value: it's dynamic, not cached, because it reads a per-visitor cookie and must run on every request.

## Note on `/menu` and streaming

`/menu` reads the `category` and `error` query params. Reading `searchParams` directly in a server page component forces the whole route to render per-request (dynamic), which breaks the static/ISR goal above. To keep `/menu` static, the query-param logic was moved into two Client Components (`CategoryBar`, `MenuDishes`) that call `useSearchParams()`, each wrapped in `<Suspense>`. Consequence: Next resolves those `<Suspense>` fallbacks *at build time* (there's no real request to read params from), so the fallback markup (pill-row skeleton, dish-grid skeleton) is what's actually baked into the static HTML. The real content then swaps in after hydration reads the real URL client-side, plus an artificial 1s `setTimeout` in `MenuDishes` so the swap is visible.

This means the sidebar-before-dishes effect on `/menu` is a **client-side hydration/timer effect**, not genuine per-request server streaming (a static page has nothing left to stream — it's fully resolved once, at build time). Real per-request Suspense streaming still exists elsewhere in this app implicitly through `app/menu/loading.jsx`, which Next shows during a client-side navigation into `/menu` while the RSC payload is still in flight over the network — that part *is* affected by connection speed.

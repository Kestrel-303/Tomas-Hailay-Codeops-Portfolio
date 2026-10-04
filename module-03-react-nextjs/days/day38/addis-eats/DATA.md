# Data fetching in Addis Eats (Day 38)

Day 38 adds client-side data fetching with [SWR](https://swr.vercel.app). Server components still do the first load; SWR takes over in the browser for anything that has to stay fresh or react to typing.

## Who fetches what

| Screen | First load | After that | Endpoint |
| --- | --- | --- | --- |
| `/menu`, `/menu/[id]`, `/home` | Server component (static / ISR) | Nothing | — |
| `/orders` | Server component (reads cookie) | Server action + `revalidatePath` | — |
| `/orders/[id]` (order status) | Server component → `fallbackData` | `useSWR`, polled every 5s | `GET /api/orders/[id]` |
| `/search` | Nothing (empty box) | `useSWR`, debounced, paged | `GET /api/dishes/search?q=&page=` |

## The shared fetcher — `lib/fetcher.js`

Every `useSWR` call uses the same `fetcher`. `fetch()` only rejects on network failure, never on a 404 or 500, so the fetcher checks `res.ok` and throws an `Error` with `status` and our API's `error` body attached. That's what makes SWR's `error` actually show up for a 401/404.

## Order status — `app/orders/[id]`

**Before (the effect + state version):**

```jsx
const [order, setOrder] = useState(null);
const [error, setError] = useState(null);

useEffect(() => {
  let cancelled = false;
  async function load() {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      if (!cancelled) setOrder(data);
    } catch (err) {
      if (!cancelled) setError(err);
    }
  }
  load();
  const timer = setInterval(load, 5000);
  return () => {
    cancelled = true;
    clearInterval(timer);
  };
}, [orderId]);
```

**After:**

```jsx
const { data: order, error } = useSWR(`/api/orders/${orderId}`, fetcher, {
  fallbackData,
  refreshInterval: (latest) => (isFinal(latest) ? 0 : 5000),
});
```

The effect, both `useState`s, the interval, and the "cancelled" flag are gone. SWR handles cleanup on unmount, deduplicates if two components ask for the same order, and revalidates when the tab regains focus.

- **Polling** — `refreshInterval` is a function, so it polls every 5s while the order can still change and returns `0` (stop) once it is `delivered` or `cancelled`. Orders move `placed → preparing → out-for-delivery → delivered` on a timer (15s / 45s / 90s after placing) in `lib/orders.js`, because there is no kitchen to update them.
- **`fallbackData`** — `page.jsx` is a server component. It reads the order straight from the store and passes it in as `fallbackData`, so the status is in the HTML on first paint: no loading spinner and no request on mount. SWR still revalidates in the background, then polls.
- **Security** — the API returns 404 for orders that aren't yours (same as a missing one), and `toPublicOrder` strips `ownerId` before anything goes to the browser.

## Search — `app/search/DishSearch.jsx`

- **Debounce** — the input updates `term` on every keystroke; `useDebouncedValue(term, 300)` only changes 300ms after typing stops. The SWR key is built from the debounced value, so typing "doro" sends one request, not four.
- **Null key** — when the trimmed term is empty, the key is `null` and SWR doesn't fetch at all. Clearing the box sends nothing.
- **`keepPreviousData: true`** — without it, every new key starts with `data === undefined`, so the list disappears and reappears between searches. With it, the old results stay on screen (dimmed, `isLoading` is true) until the new ones arrive. One catch: it also returns the old data when the key becomes `null`, so the component hides results itself when there is no key.
- **Paging** — the page number lives in the URL (`/search?q=wot&page=2`) and is part of the SWR key, so every page is cached on its own. Going back to a page you've already seen is instant. The URL is written with `window.history.pushState`/`replaceState`, which Next syncs with `useSearchParams` *without* fetching an RSC payload, so only API calls show up in the network tab. Changing the term resets to page 1, and Back/Forward step through pages. The search route has 600ms of artificial latency so all of this is visible.

## What to look for in the network tab

1. `/orders/[id]`: there's no `api/orders/...` request on load (fallbackData). Then a request every ~5s, which stops once the status reaches Delivered.
2. Switch tabs away and back: an extra request (revalidate on focus).
3. `/search`: type fast, and you get one `api/dishes/search` request after you stop. Clear the box and nothing is sent.
4. Click Next → `page=2`, then Previous: page 1 is served from the SWR cache straight away, with a background revalidation.

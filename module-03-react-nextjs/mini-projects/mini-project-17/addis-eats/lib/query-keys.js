// Every SWR key in the app is built here. Server components use the same builders, so a
// key they seed as fallback data is byte-for-byte the key the client later asks for.

export function orderKey(id) {
  return `/api/orders/${encodeURIComponent(id)}`;
}

export function menuPageKey(category, page) {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.set('category', category);
  params.set('page', String(page));
  return `/api/menu?${params}`;
}

// null = "don't fetch". An empty search box sends nothing.
export function dishSearchKey(term) {
  return term ? `/api/dishes/search?q=${encodeURIComponent(term)}` : null;
}

export function parsePage(value) {
  const page = Number.parseInt(value ?? '1', 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

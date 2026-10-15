'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import ProductGrid from '@/components/ProductGrid';
import { etb } from '@/lib/money';

// Search and price filter. Client because it reacts to every keystroke; both values live in the
// URL (?q=dior&max=12000), so a filtered view can be bookmarked or shared, and Back works.
export default function ShopView({ products, maxPrice }) {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const maxParam = Number(params.get('max'));
  const [limit, setLimit] = useState(maxParam > 0 && maxParam < maxPrice ? maxParam : maxPrice);

  function syncUrl(nextQuery, nextLimit) {
    const next = new URLSearchParams();
    if (nextQuery.trim()) next.set('q', nextQuery.trim());
    if (nextLimit < maxPrice) next.set('max', String(nextLimit));
    const search = next.toString();
    router.replace(search ? `/shop?${search}` : '/shop', { scroll: false });
  }

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) => (!q || p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)) && p.price <= limit,
    );
  }, [products, query, limit]);

  return (
    <>
      <div className="product-filters" role="search">
        <div className="product-filters__search">
          <label htmlFor="shop-search" className="field__label">
            Search
          </label>
          <input
            id="shop-search"
            type="search"
            placeholder="Fragrance or house, e.g. Dior"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              syncUrl(event.target.value, limit);
            }}
            onKeyDown={(event) => {
              // Escape clears the search in every browser (Chrome does it by itself; others don't).
              if (event.key === 'Escape' && query) {
                event.preventDefault();
                setQuery('');
                syncUrl('', limit);
              }
            }}
          />
        </div>
        <div className="product-filters__range">
          <label htmlFor="shop-price">
            Price up to <strong>{etb(limit)}</strong>
          </label>
          <input
            id="shop-price"
            type="range"
            min={0}
            max={maxPrice}
            step={500}
            value={limit}
            aria-valuetext={etb(limit)}
            onChange={(event) => {
              const value = Number(event.target.value);
              setLimit(value);
              syncUrl(query, value);
            }}
          />
        </div>
      </div>

      <p className="results-count" role="status">
        {shown.length === products.length ? `All ${products.length} fragrances` : `${shown.length} of ${products.length} fragrances`}
      </p>

      {shown.length === 0 ? (
        <div className="empty-state">
          <p className="page-section__body">No fragrances match “{query}”{limit < maxPrice ? ` under ${etb(limit)}` : ''}.</p>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setQuery('');
              setLimit(maxPrice);
              syncUrl('', maxPrice);
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ProductGrid products={shown} eagerFirst />
      )}
    </>
  );
}

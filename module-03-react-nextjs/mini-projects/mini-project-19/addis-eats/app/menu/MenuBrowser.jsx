'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SWRConfig } from 'swr';
import { useDishSearch, useMenuPage } from '@/lib/queries';
import { parsePage } from '@/lib/query-keys';
import { useDebouncedValue } from '@/lib/use-debounced-value';
import DishList from './DishList';

// `fallback` (not `fallbackData`) is keyed, so the server's page only ever stands in for the
// key it was rendered for. Page 1's data can't briefly appear under page 2's key.
export default function MenuBrowser({ initialKey, initialData }) {
  return (
    <SWRConfig value={{ fallback: { [initialKey]: initialData } }}>
      <MenuResults />
    </SWRConfig>
  );
}

// Pages are written to the URL with the native History API: Next keeps useSearchParams in
// sync, but unlike router.push it doesn't fetch an RSC payload, so the network tab shows
// only the /api/menu calls. The URL stays linkable and shareable (/menu?category=Tibs&page=2).
function goToPage(page) {
  const params = new URLSearchParams(window.location.search);
  if (page > 1) params.set('page', String(page));
  else params.delete('page');
  const query = params.toString();
  window.history.pushState(null, '', query ? `?${query}` : window.location.pathname);
}

function MenuResults() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'All';
  const page = parsePage(searchParams.get('page'));

  const [term, setTerm] = useState('');
  const debouncedTerm = useDebouncedValue(term.trim(), 300);
  const isSearching = debouncedTerm !== '';
  // True between a keystroke and the debounce firing: what's on screen is about to change.
  const isTyping = term.trim() !== debouncedTerm;

  const search = useDishSearch(debouncedTerm);
  const menu = useMenuPage(category, page);

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <label htmlFor="dish-search" style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
          Search the whole menu
        </label>
        <input
          id="dish-search"
          type="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Try “wat”, “tibs” or “ክትፎ”"
          autoComplete="off"
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      {isSearching ? (
        <SearchResults search={search} stale={isTyping || search.isLoading} />
      ) : (
        <PagedMenu menu={menu} stale={menu.isLoading} />
      )}
    </div>
  );
}

function SearchResults({ search, stale }) {
  // keepPreviousData shows the last results while the next term loads, so the list never empties.
  // The heading uses `q` from the response itself, so the label always matches the dishes under it.
  const { data, error } = search;

  if (error) return <p role="alert" className="form-error">{error.message}</p>;
  if (!data) return <p style={{ color: 'var(--text-secondary)' }}>Searching…</p>;

  return (
    <div aria-busy={stale} style={{ opacity: stale ? 0.55 : 1, transition: 'opacity 0.15s ease' }}>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        {data.total} result{data.total === 1 ? '' : 's'} for “{data.q}”{stale && ' · updating…'}
      </p>
      <DishList dishes={data.items} />
    </div>
  );
}

function PagedMenu({ menu, stale }) {
  const { data, error } = menu;

  if (error) return <p role="alert" className="form-error">{error.message}</p>;
  if (!data) return <p style={{ color: 'var(--text-secondary)' }}>Loading dishes…</p>;

  return (
    <div aria-busy={stale} style={{ opacity: stale ? 0.55 : 1, transition: 'opacity 0.15s ease' }}>
      <DishList dishes={data.items} />

      {data.totalPages > 1 && (
        <nav
          aria-label="Menu pages"
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            disabled={data.page <= 1}
            onClick={() => goToPage(data.page - 1)}
            id="menu-prev-page"
          >
            &larr; Previous
          </button>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Page {data.page} of {data.totalPages}
            {stale && ' · loading…'}
          </span>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={data.page >= data.totalPages}
            onClick={() => goToPage(data.page + 1)}
            id="menu-next-page"
          >
            Next &rarr;
          </button>
        </nav>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "../../lib/fetcher";
import { useDebouncedValue } from "../../lib/use-debounced-value";
import DishList from "../menu/DishList";

// Writes q/page into the URL with the native History API. Next syncs useSearchParams with it,
// and unlike router.push it doesn't fetch an RSC payload, so the network tab only shows API calls.
function writeUrl(q, page, method) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  window.history[method](null, "", query ? `?${query}` : window.location.pathname);
}

export default function DishSearch() {
  const searchParams = useSearchParams();
  const [term, setTerm] = useState(searchParams.get("q") ?? "");
  const debouncedTerm = useDebouncedValue(term.trim(), 300);
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);

  // A null key tells SWR "don't fetch": no request goes out while the box is empty.
  const key = debouncedTerm
    ? `/api/dishes/search?q=${encodeURIComponent(debouncedTerm)}&page=${page}`
    : null;

  // keepPreviousData: while the new key loads, keep showing the last results instead of
  // dropping to undefined (which is what made the list flash between searches).
  const { data, error, isLoading } = useSWR(key, fetcher, { keepPreviousData: true });

  // keepPreviousData also hands back old data when the key goes null, so hide it ourselves.
  const results = key ? data : undefined;

  function handleChange(event) {
    const value = event.target.value;
    setTerm(value);
    // New term → back to page 1. replaceState so each keystroke isn't its own history entry.
    writeUrl(value.trim(), 1, "replaceState");
  }

  function goToPage(nextPage) {
    // pushState so the browser back button steps back through pages.
    writeUrl(debouncedTerm, nextPage, "pushState");
  }

  return (
    <div>
      <div className="form-field" style={{ marginBottom: "1.25rem" }}>
        <label htmlFor="dish-search">Search dishes</label>
        <input
          id="dish-search"
          type="search"
          value={term}
          onChange={handleChange}
          placeholder="Start typing…"
          autoComplete="off"
        />
      </div>

      {!key && <p className="page-subtitle">Type something to search the menu.</p>}

      {error && (
        <p role="alert" className="form-error">
          {error.message}
        </p>
      )}

      {key && !results && isLoading && <p className="page-subtitle">Searching…</p>}

      {results && (
        <div aria-busy={isLoading} style={{ opacity: isLoading ? 0.55 : 1, transition: "opacity 0.15s ease" }}>
          <p className="dish-category" style={{ marginBottom: "0.75rem" }}>
            {isLoading
              ? "Searching…"
              : `${results.total} result${results.total === 1 ? "" : "s"} for “${debouncedTerm}”`}
          </p>

          {results.items.length === 0 ? (
            <div className="empty-state">
              <h2 style={{ fontSize: "1.1rem" }}>No dishes match</h2>
            </div>
          ) : (
            <DishList dishes={results.items} />
          )}

          {results.totalPages > 1 && (
            <div className="actions-row" style={{ alignItems: "center" }}>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={results.page <= 1}
                onClick={() => goToPage(results.page - 1)}
              >
                ← Previous
              </button>
              <span className="dish-category">
                Page {results.page} of {results.totalPages}
              </span>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={results.page >= results.totalPages}
                onClick={() => goToPage(results.page + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

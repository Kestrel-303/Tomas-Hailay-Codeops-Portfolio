'use client';

import useSWR from 'swr';
import { dishSearchKey, menuPageKey } from './query-keys';

// Every client query in the app, with its refresh rules in one place (see DATA.md). The order
// tracker isn't here any more: since mini-project 19 it follows a live stream (TRACKING.md).
// No fetcher is passed here: the shared one comes from <SWRConfig> in app/Providers.jsx.

const MENU_FRESH_MS = 60_000;

// One page of the menu. The menu only changes on deploy/ISR, so cached pages are trusted for 60s.
export function useMenuPage(category, page) {
  return useSWR(menuPageKey(category, page), {
    keepPreviousData: true,
    dedupingInterval: MENU_FRESH_MS,
    revalidateOnFocus: false,
  });
}

// Dish search. `term` must already be debounced; an empty term is a null key (no request).
export function useDishSearch(term) {
  return useSWR(dishSearchKey(term), {
    keepPreviousData: true,
    dedupingInterval: MENU_FRESH_MS,
    revalidateOnFocus: false,
  });
}

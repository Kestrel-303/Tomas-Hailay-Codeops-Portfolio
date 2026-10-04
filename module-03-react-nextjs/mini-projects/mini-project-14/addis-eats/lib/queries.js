'use client';

import useSWR from 'swr';
import { dishSearchKey, menuPageKey, orderKey } from './query-keys';

// Every client query in the app, with its refresh rules in one place (see DATA.md).
// No fetcher is passed here: the shared one comes from <SWRConfig> in app/Providers.jsx.

const FINAL_STATUSES = ['delivered', 'cancelled'];
export const ORDER_POLL_MS = 5000;
const MENU_FRESH_MS = 60_000;

// Order status: polled every 5s until it can't change any more.
export function useOrder(id, fallbackData) {
  return useSWR(orderKey(id), {
    fallbackData,
    refreshInterval: (latest) => (latest && FINAL_STATUSES.includes(latest.status) ? 0 : ORDER_POLL_MS),
  });
}

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

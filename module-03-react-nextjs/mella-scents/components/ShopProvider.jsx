'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CART_COOKIE, MAX_QTY, parseCart, serializeCart } from '@/lib/cart-cookie';

// The bag, the wishlist and who's signed in, for the client components that need them (header
// counts, add and wishlist buttons, the bag page). Replaces the Vite version's two Zustand stores
// and AuthContext.
//   - Bag: ids and quantities live in the `ms_bag` cookie, which checkout reads on the server and
//     prices from the catalogue. Names, photos and prices for display are kept in localStorage.
//   - Wishlist: localStorage, as before.
//   - Session: asked from /api/session, so the root layout never reads cookies (which would make
//     every page dynamic). For display only: the server checks the real session itself.
const ShopContext = createContext(null);
const DETAILS_KEY = 'ms_bag_details';
const WISHLIST_KEY = 'ms_wishlist';

const readJson = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};
const readCookie = () => document.cookie.split('; ').find((c) => c.startsWith(`${CART_COOKIE}=`))?.slice(CART_COOKIE.length + 1);
const writeCookie = (lines) => {
  document.cookie = `${CART_COOKIE}=${encodeURIComponent(serializeCart(lines))}; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax`;
};

// Only what the bag needs to show a line; the server never trusts it.
const summary = ({ id, slug, title, brand, price, image, stock }) => ({ id: String(slug ?? id), title, brand, price, image, stock });

export function ShopProvider({ children }) {
  const [lines, setLines] = useState([]); // [{ id, qty }]
  const [details, setDetails] = useState({}); // id → summary
  const [wishlist, setWishlist] = useState([]); // [summary]
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Load what this browser saved, once, after hydration (the server can't see localStorage).
  useEffect(() => {
    setLines(parseCart(readCookie()));
    setDetails(readJson(DETAILS_KEY, {}));
    setWishlist(readJson(WISHLIST_KEY, []));
    setReady(true);
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch('/api/session', { cache: 'no-store' });
      setUser((await res.json()).user ?? null);
    } catch {
      setUser(null);
    }
  }, []);
  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    if (!ready) return;
    writeCookie(lines);
    localStorage.setItem(DETAILS_KEY, JSON.stringify(details));
  }, [lines, details, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist, ready]);

  const addToBag = useCallback((product, qty = 1) => {
    const item = summary(product);
    setDetails((d) => ({ ...d, [item.id]: item }));
    setLines((current) => {
      const existing = current.find((line) => line.id === item.id);
      const limit = Math.min(MAX_QTY, item.stock ?? MAX_QTY);
      if (existing) return current.map((line) => (line.id === item.id ? { ...line, qty: Math.min(limit, line.qty + qty) } : line));
      return [...current, { id: item.id, qty: Math.min(limit, qty) }];
    });
  }, []);

  const setQuantity = useCallback((id, qty) => {
    setLines((current) => (qty < 1 ? current.filter((line) => line.id !== id) : current.map((line) => (line.id === id ? { ...line, qty: Math.min(MAX_QTY, qty) } : line))));
  }, []);

  const removeFromBag = useCallback((id) => setLines((current) => current.filter((line) => line.id !== id)), []);
  const clearBag = useCallback(() => setLines([]), []);

  const toggleWishlist = useCallback((product) => {
    const item = summary(product);
    setWishlist((current) => (current.some((w) => w.id === item.id) ? current.filter((w) => w.id !== item.id) : [...current, item]));
  }, []);

  const value = useMemo(() => {
    const bag = lines.filter((line) => details[line.id]).map((line) => ({ ...details[line.id], qty: line.qty }));
    return {
      ready,
      user,
      refreshSession,
      bag,
      bagCount: bag.reduce((sum, line) => sum + line.qty, 0),
      bagTotal: bag.reduce((sum, line) => sum + line.price * line.qty, 0),
      addToBag,
      setQuantity,
      removeFromBag,
      clearBag,
      wishlist,
      isWished: (id) => wishlist.some((w) => w.id === String(id)),
      toggleWishlist,
    };
  }, [ready, user, refreshSession, lines, details, wishlist, addToBag, setQuantity, removeFromBag, clearBag, toggleWishlist]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used inside <ShopProvider>');
  return context;
}

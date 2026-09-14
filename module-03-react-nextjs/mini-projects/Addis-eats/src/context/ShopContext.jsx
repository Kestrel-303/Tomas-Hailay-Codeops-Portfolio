import { createContext, useContext, useEffect, useMemo, useState } from "react";
import dishes from "../data/dishes.json";

const ShopContext = createContext(null);

const CART_KEY = "addis_eats_cart_v2";
const WISHLIST_KEY = "addis_eats_wishlist_v2";

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => readStorage(CART_KEY, []));
  const [wishlist, setWishlist] = useState(() => readStorage(WISHLIST_KEY, []));

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  function addToCart(id, qty = 1) {
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        return prev.map(item =>
          item.id === id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { id, qty }];
    });
  }

  function updateQty(id, qty) {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => (item.id === id ? { ...item, qty } : item)));
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(item => item.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  function toggleWishlist(id) {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
    );
  }

  const cartDetailed = useMemo(
    () =>
      cart
        .map(item => {
          const dish = dishes.find(d => d.id === item.id);
          return dish ? { ...dish, qty: item.qty } : null;
        })
        .filter(Boolean),
    [cart]
  );

  const wishlistDetailed = useMemo(
    () => dishes.filter(d => wishlist.includes(d.id)),
    [wishlist]
  );

  const subtotal = useMemo(
    () => cartDetailed.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cartDetailed]
  );

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);

  const value = {
    dishes,
    cart,
    cartDetailed,
    cartCount,
    subtotal,
    wishlist,
    wishlistDetailed,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    toggleWishlist
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}

"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "addis-eats-cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      // One-time sync from localStorage (an external store with no window
      // to render from on the server), so this can't be a lazy useState
      // initializer without causing a server/client hydration mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // localStorage unavailable or corrupt - start with an empty cart
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage unavailable - cart just won't persist across reloads
    }
  }, [items]);

  function addItem(dish) {
    setItems((current) => {
      const existing = current.find((item) => item.id === dish.id);
      if (existing) {
        return current.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { id: dish.id, name: dish.name, price: dish.price, quantity: 1 }];
    });
  }

  function removeItem(id) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function updateQuantity(id, quantity) {
    setItems((current) => {
      if (quantity <= 0) return current.filter((item) => item.id !== id);
      return current.map((item) => (item.id === id ? { ...item, quantity } : item));
    });
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

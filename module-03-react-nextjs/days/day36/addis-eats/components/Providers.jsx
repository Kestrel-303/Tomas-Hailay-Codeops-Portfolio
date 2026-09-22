"use client";

import { CartProvider } from "../lib/cart-context";

export default function Providers({ children }) {
  return <CartProvider>{children}</CartProvider>;
}

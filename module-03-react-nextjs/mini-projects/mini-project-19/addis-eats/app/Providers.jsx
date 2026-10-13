'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { SWRConfig } from 'swr';
import { getCart } from '@/lib/cart';
import { fetcher } from '@/lib/fetcher';

const CartContext = createContext({ itemCount: 0, refreshCart: () => {} });

export function useCartContext() {
  return useContext(CartContext);
}

export default function Providers({ children }) {
  const [itemCount, setItemCount] = useState(0);

  const refreshCart = () => {
    const items = getCart();
    setItemCount(items.reduce((sum, item) => sum + Number(item.qty || 0), 0));
  };

  useEffect(() => {
    refreshCart();
  }, []);

  // Every useSWR call in the app inherits this fetcher, so no query can forget the res.ok check.
  return (
    <SWRConfig value={{ fetcher }}>
      <CartContext.Provider value={{ itemCount, refreshCart }}>{children}</CartContext.Provider>
    </SWRConfig>
  );
}

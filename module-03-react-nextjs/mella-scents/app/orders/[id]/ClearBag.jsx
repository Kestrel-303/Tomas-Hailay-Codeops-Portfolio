'use client';

import { useEffect } from 'react';
import { useShop } from '@/components/ShopProvider';

// After a successful checkout the server has already deleted the bag cookie; this empties the
// browser's copy too, so the header count drops to zero on the receipt.
export default function ClearBag() {
  const { ready, clearBag } = useShop();
  useEffect(() => {
    if (ready) clearBag();
  }, [ready, clearBag]);
  return null;
}

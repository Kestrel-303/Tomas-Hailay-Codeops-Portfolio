'use client';

import { useState } from 'react';
import { addToCart } from '@/lib/cart';

export default function AddToCartButton({ dish, className, style, id, children }) {
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addToCart(dish);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button type="button" onClick={handleClick} className={className} style={style} id={id}>
      {added ? 'Added ✓' : children}
    </button>
  );
}

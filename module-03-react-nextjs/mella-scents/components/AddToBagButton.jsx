'use client';

import { useEffect, useState } from 'react';
import { useShop } from './ShopProvider';

// Client: it changes the bag. The confirmation is announced (aria-live) as well as shown, and the
// button says what it adds, so a screen-reader user hears "Add Dior J'adore to bag".
export default function AddToBagButton({ product, className = 'btn btn-solid', label = 'Add to Bag' }) {
  const { addToBag } = useShop();
  const [added, setAdded] = useState(false);
  const soldOut = product.stock < 1;

  useEffect(() => {
    if (!added) return undefined;
    const timer = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(timer);
  }, [added]);

  return (
    <>
      <button
        type="button"
        className={className}
        disabled={soldOut}
        aria-label={soldOut ? `${product.title} is sold out` : `Add ${product.title} to bag`}
        onClick={() => {
          addToBag(product);
          setAdded(true);
        }}
      >
        {soldOut ? 'Sold Out' : added ? 'Added ✓' : label}
      </button>
      <span className="visually-hidden" aria-live="polite">
        {added ? `${product.title} added to your bag.` : ''}
      </span>
    </>
  );
}

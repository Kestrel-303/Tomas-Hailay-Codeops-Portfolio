'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useShop } from './ShopProvider';

// Saving a fragrance needs an account, as in the Vite version: signed out, the heart sends you to
// sign in and brings you back. A toggle button (aria-pressed), named after the fragrance.
export default function WishlistButton({ product, className = 'product-card__wishlist' }) {
  const { user, isWished, toggleWishlist } = useShop();
  const router = useRouter();
  const pathname = usePathname();
  const wished = isWished(product.slug ?? product.id);

  return (
    <button
      type="button"
      className={`${className}${wished ? ' is-active' : ''}`}
      aria-pressed={wished}
      aria-label={wished ? `Remove ${product.title} from wishlist` : `Save ${product.title} to wishlist`}
      onClick={() => {
        if (!user) {
          router.push(`/login?next=${encodeURIComponent(pathname)}`);
          return;
        }
        toggleWishlist(product);
      }}
    >
      <span aria-hidden="true">{wished ? '♥' : '♡'}</span>
    </button>
  );
}

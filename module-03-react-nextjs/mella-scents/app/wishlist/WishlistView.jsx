'use client';

import Image from 'next/image';
import Link from 'next/link';
import AddToBagButton from '@/components/AddToBagButton';
import { useShop } from '@/components/ShopProvider';
import { etb } from '@/lib/money';

export default function WishlistView() {
  const { ready, wishlist, toggleWishlist } = useShop();

  if (!ready) return <p className="status-message">Loading your wishlist…</p>;

  if (wishlist.length === 0) {
    return (
      <div className="empty-state">
        <p className="page-section__body">You haven&apos;t saved any fragrances yet. Tap the ♡ on a fragrance to keep it here.</p>
        <Link href="/shop" className="btn btn-solid">
          Explore the Collection
        </Link>
      </div>
    );
  }

  return (
    <ul className="wish-list">
      {wishlist.map((item) => (
        <li key={item.id} className="wish-item">
          <Link href={`/product/${item.id}`} className="cart-item__image-wrap" tabIndex={-1} aria-hidden="true">
            <Image src={item.image} alt="" width={1000} height={1000} sizes="80px" />
          </Link>
          <div className="cart-item__info">
            <p className="cart-item__brand">{item.brand}</p>
            <h2 className="cart-item__title">
              <Link href={`/product/${item.id}`}>{item.title}</Link>
            </h2>
            <p className="cart-item__price">{etb(item.price)}</p>
          </div>
          <div className="wish-item__actions">
            <AddToBagButton product={{ ...item, slug: item.id }} className="btn btn-solid" />
            <button type="button" className="cart-item__remove" onClick={() => toggleWishlist(item)} aria-label={`Remove ${item.title} from wishlist`}>
              Remove
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

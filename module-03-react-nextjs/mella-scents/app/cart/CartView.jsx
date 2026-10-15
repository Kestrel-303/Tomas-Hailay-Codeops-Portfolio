'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useShop } from '@/components/ShopProvider';
import { MAX_QTY } from '@/lib/cart-cookie';
import { etb } from '@/lib/money';

export default function CartView() {
  const { ready, bag, bagTotal, setQuantity, removeFromBag } = useShop();

  if (!ready) return <p className="status-message">Loading your bag…</p>;

  if (bag.length === 0) {
    return (
      <div className="empty-state">
        <p className="page-section__body">Your bag is empty.</p>
        <Link href="/shop" className="btn btn-solid">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <ul className="cart-list">
        {bag.map((item) => (
          <li key={item.id} className="cart-item">
            <Link href={`/product/${item.id}`} className="cart-item__image-wrap" tabIndex={-1} aria-hidden="true">
              <Image src={item.image} alt="" width={1000} height={1000} sizes="80px" />
            </Link>
            <div className="cart-item__info">
              <p className="cart-item__brand">{item.brand}</p>
              <h2 className="cart-item__title">
                <Link href={`/product/${item.id}`}>{item.title}</Link>
              </h2>
              <p className="cart-item__price">{etb(item.price)} each</p>
            </div>
            <div className="cart-item__quantity" role="group" aria-label={`Quantity of ${item.title}`}>
              <button type="button" onClick={() => setQuantity(item.id, item.qty - 1)} aria-label={`One fewer ${item.title}`}>
                −
              </button>
              <span aria-live="polite">{item.qty}</span>
              <button
                type="button"
                onClick={() => setQuantity(item.id, item.qty + 1)}
                aria-label={`One more ${item.title}`}
                disabled={item.qty >= Math.min(MAX_QTY, item.stock ?? MAX_QTY)}
              >
                +
              </button>
            </div>
            <p className="cart-item__line-total">{etb(item.price * item.qty)}</p>
            <button type="button" className="cart-item__remove" onClick={() => removeFromBag(item.id)} aria-label={`Remove ${item.title} from bag`}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="cart-summary">
        <div className="cart-summary__row">
          <span>Delivery in Addis Ababa</span>
          <span>Complimentary</span>
        </div>
        <div className="cart-summary__row cart-summary__row--total">
          <span>Total</span>
          <span className="cart-summary__total">{etb(bagTotal)}</span>
        </div>
        <Link href="/checkout" className="btn btn-solid">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}

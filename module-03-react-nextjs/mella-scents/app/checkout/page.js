import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { CART_COOKIE, parseCart } from '@/lib/cart-cookie';
import { etb } from '@/lib/money';
import { validateLines } from '@/lib/order-schema';
import { getProducts } from '@/lib/products';
import { getSession } from '@/lib/session';
import { NO_INDEX } from '@/lib/site';
import CheckoutForm from './CheckoutForm';

export const metadata = { title: 'Checkout', robots: NO_INDEX };

// Dynamic: it reads the session and the bag cookie on every request. The summary is priced here,
// from the catalogue, so it shows exactly what the server action will charge.
export default async function CheckoutPage() {
  // Layer 2: checked while rendering too, not only in proxy.js.
  const session = await getSession();
  if (!session) redirect('/login?next=/checkout');

  const store = await cookies();
  const lines = parseCart(store.get(CART_COOKIE)?.value);
  const { items, error } = lines.length ? validateLines(lines, await getProducts()) : { items: [] };
  const total = (items ?? []).reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <section className="page-section container checkout-page">
      <p className="page-section__eyebrow">Secure Checkout</p>
      <h1 className="page-section__title">Delivery &amp; Payment</h1>

      {lines.length === 0 ? (
        <div className="empty-state">
          <p className="page-section__body">Your bag is empty. Add a fragrance before checking out.</p>
          <Link href="/shop" className="btn btn-solid">
            Explore the Collection
          </Link>
        </div>
      ) : error ? (
        <div className="empty-state">
          <p role="alert" className="field__error">
            {error}
          </p>
          <Link href="/cart" className="btn">
            Review your bag
          </Link>
        </div>
      ) : (
        <div className="checkout-layout">
          <aside className="order-summary" aria-labelledby="summary-title">
            <h2 id="summary-title" className="order-summary__title">
              Your order
            </h2>
            <ul>
              {items.map((item) => (
                <li key={item.id}>
                  <span>
                    {item.title} × {item.qty}
                  </span>
                  <span>{etb(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>
            <p className="order-summary__row">
              <span>Delivery</span>
              <span>Complimentary</span>
            </p>
            <p className="order-summary__row order-summary__row--total">
              <span>Total</span>
              <span>{etb(total)}</span>
            </p>
          </aside>
          <CheckoutForm total={total} defaultName={session.name} />
        </div>
      )}
    </section>
  );
}

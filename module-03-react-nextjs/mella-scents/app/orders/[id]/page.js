import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { formatOrderTime } from '@/lib/dates';
import { etb } from '@/lib/money';
import { getOrder } from '@/lib/orders';
import { getSession } from '@/lib/session';
import { NO_INDEX } from '@/lib/site';
import ClearBag from './ClearBag';

export const metadata = { title: 'Your order', robots: NO_INDEX };

// The receipt, as a real page that can be revisited and bookmarked. (In the Vite version it only
// existed as navigation state, so a refresh lost it.) Only the order's owner can see it.
export default async function OrderPage({ params, searchParams }) {
  const { id } = await params;
  const { placed } = await searchParams;

  const session = await getSession();
  if (!session) redirect(`/login?next=/orders/${id}`);
  const order = getOrder(id);
  // Someone else's order looks exactly like one that doesn't exist, so order ids can't be probed.
  if (!order || order.userId !== session.id) notFound();

  return (
    <section className="page-section container receipt">
      {placed && <ClearBag />}
      <p className="page-section__eyebrow">{placed ? 'Order Confirmed' : 'Order'}</p>
      <h1 className="page-section__title">{placed ? `Thank you, ${order.customer.name}` : `Order ${order.id}`}</h1>
      <p className="page-section__body">
        Your order is on its way to {order.customer.area}, Addis Ababa. TeleBirr payment {order.payment.reference} was confirmed for{' '}
        {order.customer.phone}.
      </p>

      <div className="receipt__card">
        <dl className="receipt__meta">
          <div>
            <dt>Order</dt>
            <dd>{order.id}</dd>
          </div>
          <div>
            <dt>Placed</dt>
            <dd>
              <time dateTime={order.placedAt}>{formatOrderTime(order.placedAt)}</time>
            </dd>
          </div>
          <div>
            <dt>Payment</dt>
            <dd>TeleBirr · paid</dd>
          </div>
        </dl>
        <ul className="receipt__items">
          {order.items.map((item) => (
            <li key={item.id}>
              <Image src={item.image} alt="" width={1000} height={1000} sizes="56px" />
              <span>
                {item.title} <span className="muted">× {item.qty}</span>
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
          <span>Total paid</span>
          <span>{etb(order.total)}</span>
        </p>
      </div>

      <div className="receipt__actions">
        <Link href="/shop" className="btn btn-solid">
          Continue Shopping
        </Link>
        <Link href="/account" className="btn">
          All your orders
        </Link>
      </div>
    </section>
  );
}

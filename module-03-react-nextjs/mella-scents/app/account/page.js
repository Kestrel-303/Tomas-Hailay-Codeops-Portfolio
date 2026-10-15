import Link from 'next/link';
import { redirect } from 'next/navigation';
import { signOut } from '@/app/login/actions';
import SubmitButton from '@/components/SubmitButton';
import { formatOrderTime } from '@/lib/dates';
import { etb } from '@/lib/money';
import { getOrdersByUser } from '@/lib/orders';
import { getSession } from '@/lib/session';
import { NO_INDEX } from '@/lib/site';

export const metadata = { title: 'Your Account', robots: NO_INDEX };

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect('/login?next=/account');
  // Scoped to the verified session: there's no id in the URL to change.
  const orders = getOrdersByUser(session.id);

  return (
    <section className="page-section container">
      <p className="page-section__eyebrow">Your Account</p>
      <h1 className="page-section__title">Hello, {session.name}</h1>
      <p className="page-section__body">Signed in as {session.email}.</p>

      <h2 className="account__heading">Your orders</h2>
      {orders.length === 0 ? (
        <div className="empty-state">
          <p className="page-section__body">No orders yet. When you check out, your receipts will be here.</p>
          <Link href="/shop" className="btn btn-solid">
            Explore the Collection
          </Link>
        </div>
      ) : (
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order.id}>
              <Link href={`/orders/${order.id}`} className="order-list__link">
                <span className="order-list__id">{order.id}</span>
                <span className="muted">
                  <time dateTime={order.placedAt}>{formatOrderTime(order.placedAt)}</time> · {order.items.reduce((n, i) => n + i.qty, 0)} items
                </span>
                <span className="order-list__total">{etb(order.total)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <form action={signOut} className="account__signout">
        <SubmitButton className="btn" pendingText="Signing out…">
          Sign Out
        </SubmitButton>
      </form>
    </section>
  );
}

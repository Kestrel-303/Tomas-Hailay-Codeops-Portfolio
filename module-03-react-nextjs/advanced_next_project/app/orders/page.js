import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getOrdersByOwner } from '@/lib/orders';
import { getSession } from '@/lib/session';
import { NO_INDEX } from '@/lib/site';
import { etb, relative, when } from '@/lib/format';
import CancelOrderButton from './CancelOrderButton';

export const metadata = {
  title: 'My orders',
  description: 'Every order you have placed with Addis Eats, with its status, items and total, and the option to cancel before the kitchen starts.',
  robots: NO_INDEX,
};

// Private and per-account, so it reads the session cookie and renders on every request.
export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect('/sign-in?next=/orders');

  // Scoped to session.id from the verified cookie. There is no id in the URL or a form to
  // change, so there is no way to ask this page for another account's orders.
  const orders = getOrdersByOwner(session.id);
  const now = Date.now();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.25rem' }}>My Orders</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: orders.length ? '1rem' : '2rem' }}>
        Signed in as {session.name}. Orders can be cancelled until the kitchen starts on them.
      </p>
      {orders.length > 0 && (
        // A plain link: the route answers with Content-Disposition: attachment, so the browser
        // saves the file instead of opening it. Only this account's orders are in it.
        <a href="/orders/export.csv" className="btn btn-secondary" download style={{ marginBottom: '2rem' }} id="orders-export-csv">
          ⬇ Export order history (CSV, {orders.length} {orders.length === 1 ? 'order' : 'orders'})
        </a>
      )}

      {orders.length === 0 ? (
        // What a brand-new customer sees: what this page is for and how to get started, instead
        // of an empty list.
        <div className="state-container">
          <div className="state-icon">🧾</div>
          <h2 className="state-title">No orders yet</h2>
          <p className="state-text">
            When you place an order, it shows up here with its status, from placed to delivered. You can cancel it until
            the kitchen starts cooking.
          </p>
          <Link href="/menu" className="btn btn-primary" id="orders-empty-menu-link">
            Browse the Menu
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((order) => (
            <div
              key={order.id}
              className="card"
              style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}
            >
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{order.id}</h3>
                  <span className={`badge ${order.status === 'cancelled' ? 'badge-red' : order.status === 'delivered' ? 'badge-green' : 'badge-gold'}`}>{order.status}</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {order.items.map((item) => `${item.name} × ${item.qty}`).join(', ')}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  <time dateTime={order.placedAt}>{when(order.placedAt)}</time> ({relative(order.placedAt, now)})
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent-gold)' }}>{etb(order.total)}</div>
                <Link href={`/orders/${order.id}`} className="track-link">
                  Track →
                </Link>
                {order.status === 'placed' && <CancelOrderButton orderId={order.id} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

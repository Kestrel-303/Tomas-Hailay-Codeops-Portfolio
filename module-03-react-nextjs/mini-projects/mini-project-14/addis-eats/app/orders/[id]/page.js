import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrderById, toOwnerOrder } from '@/lib/orders';
import { getSession } from '@/lib/session';
import OrderStatusBadge from './OrderStatusBadge';
import OrderTracker from './OrderTracker';

export const metadata = { title: 'Order Status - Addis Eats' };

// Server-rendered: the order is read straight from the store, so the status is already in
// the HTML. Both client components get it as fallbackData (no spinner on first paint) and
// then poll the same SWR key, which SWR turns into a single request every 5s.
export default async function OrderStatusPage({ params }) {
  const { id } = await params;
  const session = await getSession();
  const order = getOrderById(id);

  if (!session || !order || order.ownerId !== session.id) {
    notFound();
  }

  const initialOrder = toOwnerOrder(order);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/orders" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
          &larr; Order Board
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Order {initialOrder.id}</h1>
        <OrderStatusBadge orderId={initialOrder.id} fallbackData={initialOrder} />
      </div>

      <OrderTracker orderId={initialOrder.id} fallbackData={initialOrder} />
    </div>
  );
}

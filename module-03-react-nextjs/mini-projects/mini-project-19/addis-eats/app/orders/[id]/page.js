import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getOrderById } from '@/lib/orders';
import { getSession } from '@/lib/session';
import { NO_INDEX } from '@/lib/site';
import { toTrackedOrder } from '@/lib/tracking';
import OrderTracker from './OrderTracker';

export const metadata = {
  title: 'Track your order',
  description: 'Live status of your Addis Eats order, with a map of the courier and the same details written out beside it.',
  robots: NO_INDEX,
};

// Server-rendered: the order and the courier's position are read straight from the store, so
// the status, the delivery details and the map's placeholder are all in the first HTML.
// OrderTracker starts from that snapshot, then follows /api/orders/:id/stream.
export default async function OrderStatusPage({ params }) {
  const { id } = await params;

  // Layer 2: verified while rendering, not only in proxy.js. Someone else's order gets the
  // same 404 as one that doesn't exist, so order ids can't be probed.
  const session = await getSession();
  if (!session) redirect(`/sign-in?next=${encodeURIComponent(`/orders/${id}`)}`);

  const order = getOrderById(id);
  if (!order || order.ownerId !== session.id) {
    notFound();
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/orders" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
          &larr; My Orders
        </Link>
      </div>

      <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '1.25rem' }}>Order {order.id}</h1>

      <OrderTracker initialOrder={toTrackedOrder(order)} />
    </div>
  );
}

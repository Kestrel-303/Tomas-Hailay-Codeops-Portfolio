import { errorResponse } from '@/lib/api-errors';
import { getOrderById, toOwnerOrder } from '@/lib/orders';
import { getSession } from '@/lib/session';

// Polled every 5s by the order-status page, so it must never be served from a cache.
export const dynamic = 'force-dynamic';

export async function GET(_request, { params }) {
  const { id } = await params;

  const session = await getSession();
  if (!session) {
    return errorResponse(401, 'UNAUTHORIZED', 'Please sign in to view an order.');
  }

  const order = getOrderById(id);
  // Someone else's order gets the same 404 as a missing one, so ids can't be probed.
  if (!order || order.ownerId !== session.id) {
    return errorResponse(404, 'NOT_FOUND', `No order with id "${id}".`);
  }

  return Response.json(toOwnerOrder(order));
}

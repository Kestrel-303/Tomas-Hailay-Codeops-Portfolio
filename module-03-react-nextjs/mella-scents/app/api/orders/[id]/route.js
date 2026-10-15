import { errorResponse } from '@/lib/api-errors';
import { getOrder, toPublicOrder } from '@/lib/orders';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

// GET /api/orders/:id: your own order. Someone else's order gets the same 404 as one that doesn't
// exist, so order ids can't be probed.
export async function GET(_request, { params }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return errorResponse(401, 'Sign in to see an order');
  const order = getOrder(id);
  if (!order || order.userId !== session.id) return errorResponse(404, 'Order not found');
  return Response.json(toPublicOrder(order), { headers: { 'Cache-Control': 'private, no-store' } });
}

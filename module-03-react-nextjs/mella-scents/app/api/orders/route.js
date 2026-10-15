import { errorResponse } from '@/lib/api-errors';
import { validateCustomer, validateLines } from '@/lib/order-schema';
import { createOrder, toPublicOrder } from '@/lib/orders';
import { getProducts } from '@/lib/products';
import { getSession } from '@/lib/session';

// POST /api/orders: the same order intake as the checkout form, for non-browser clients.
// Body: { name, phone, area, notes?, items: [{ id, qty }] }. Prices are never read from the body.
// An optional Idempotency-Key header makes retries safe: the same key returns the same order.
export async function POST(request) {
  const session = await getSession();
  if (!session) return errorResponse(401, 'Sign in to place an order');

  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse(400, 'Request body must be valid JSON');
  }

  const { values, fieldErrors } = validateCustomer(body);
  if (Object.keys(fieldErrors).length) return errorResponse(422, 'Validation failed', { fieldErrors });

  const { items, error } = validateLines(body?.items, await getProducts());
  if (error) return errorResponse(422, 'Validation failed', { fieldErrors: { items: error } });

  const order = createOrder({ userId: session.id, customer: values, items, requestId: request.headers.get('idempotency-key') });
  return Response.json(toPublicOrder(order), { status: 201, headers: { Location: `/api/orders/${order.id}` } });
}

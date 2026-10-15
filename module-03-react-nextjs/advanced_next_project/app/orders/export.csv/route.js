import { errorResponse } from '@/lib/api-errors';
import { csvResponse, toCsv } from '@/lib/csv';
import { when } from '@/lib/format';
import { getOrdersByOwner } from '@/lib/orders';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

// The customer's order history, one CSV row per order. The free-text cells (name, street and
// landmark, the dish list) are the ones that hold commas and quotes, and lib/csv.js quotes
// them. Amounts are bare numbers under "(ETB)" headers, so a spreadsheet can add them up.
const COLUMNS = [
  { header: 'Order', value: (o) => o.id },
  { header: 'Placed (Addis Ababa time)', value: (o) => when(o.placedAt, 'sheet') },
  { header: 'Status', value: (o) => o.status },
  { header: 'Name', value: (o) => o.customer.name },
  { header: 'Neighbourhood', value: (o) => o.customer.area },
  { header: 'Street, building or landmark', value: (o) => o.customer.address },
  { header: 'Payment', value: (o) => o.paymentMethod },
  { header: 'Dishes', value: (o) => o.items.map((item) => `${item.name} × ${item.qty}`).join(', ') },
  { header: 'Subtotal (ETB)', value: (o) => o.subtotal },
  { header: 'Delivery (ETB)', value: (o) => o.deliveryFee },
  { header: 'VAT (ETB)', value: (o) => o.tax },
  { header: 'Total (ETB)', value: (o) => o.total },
];

// GET /orders/export.csv. proxy.js already sends signed-out visitors to sign-in, but the route
// checks for itself anyway, like every route handler. The owner id comes from the session,
// never from the URL, so nobody can download someone else's history.
export async function GET() {
  const session = await getSession();
  if (!session) return errorResponse(401, 'UNAUTHORIZED', 'Please sign in to export your orders.');

  const orders = getOrdersByOwner(session.id);
  return csvResponse(toCsv(COLUMNS, orders), `addis-eats-orders-${when(Date.now(), 'day-key')}.csv`);
}

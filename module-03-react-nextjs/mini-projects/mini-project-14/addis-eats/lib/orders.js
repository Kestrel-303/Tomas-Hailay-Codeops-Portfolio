import 'server-only';
import { computeTotals } from './pricing';

// In-memory order store, kept on globalThis so dev hot reloads don't wipe it.
// Orders are lost when the server restarts.
const store = globalThis.__addisEatsOrders ?? (globalThis.__addisEatsOrders = []);

// There's no kitchen app yet, so an order moves through these stages on a timer
// (seconds since it was placed). That gives the polling status page something to show.
const STAGES = [
  { status: 'placed', until: 15 },
  { status: 'preparing', until: 45 },
  { status: 'out-for-delivery', until: 90 },
  { status: 'delivered', until: Infinity },
];

function advance(order) {
  if (!order || order.status === 'cancelled' || order.status === 'delivered') return order;
  const seconds = (Date.now() - new Date(order.placedAt).getTime()) / 1000;
  order.status = STAGES.find((stage) => seconds < stage.until).status;
  return order;
}

export function createOrder({ ownerId, name, phone, address, paymentMethod, items }) {
  const order = {
    id: `AE-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
    ownerId,
    customer: { name, phone, address },
    paymentMethod,
    items,
    ...computeTotals(items),
    status: 'placed',
    placedAt: new Date().toISOString(),
  };
  store.push(order);
  return order;
}

export function getOrderById(id) {
  return advance(store.find((order) => order.id === id));
}

export function cancelOrderById(id) {
  const order = getOrderById(id);
  if (order) order.status = 'cancelled';
  return order;
}

// What the public orders board may show: no owner id, phone or address.
export function toPublicOrder(order) {
  return {
    id: order.id,
    firstName: order.customer.name.split(' ')[0],
    items: order.items.map(({ name, qty }) => ({ name, qty })),
    total: order.total,
    status: order.status,
    placedAt: order.placedAt,
  };
}

export function getPublicOrders() {
  return store.map((order) => toPublicOrder(advance(order))).reverse();
}

// What the order's owner sees on the status page: everything except the session id.
export function toOwnerOrder(order) {
  const { ownerId, ...rest } = order;
  return rest;
}

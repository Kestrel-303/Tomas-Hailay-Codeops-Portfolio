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

// One account's orders, newest first. The owner id must come from getSession(), never from
// the URL or a form field: that's what stops one account listing another's orders.
export function getOrdersByOwner(ownerId) {
  return store
    .filter((order) => order.ownerId === ownerId)
    .map(advance)
    .reverse();
}

// Every order, newest first. Only the staff-only /kitchen page may call this.
export function getAllOrders() {
  return store.map(advance).reverse();
}

// What the owner (or the kitchen) sees: everything except the owner's account id.
export function toOwnerOrder(order) {
  const { ownerId, ...rest } = order;
  return rest;
}

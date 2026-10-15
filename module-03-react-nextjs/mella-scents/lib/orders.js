import 'server-only';
import { randomBytes } from 'node:crypto';

// In-memory order store, kept on globalThis so dev hot reloads don't wipe it. Orders are lost
// when the server restarts (see "Known limits" in the README).
const store = globalThis.__mellaOrders ?? (globalThis.__mellaOrders = []);

// requestId → order id, per account. A checkout form sends the same requestId if it's submitted
// twice (or an API client retries with the same Idempotency-Key): the second time returns the order
// already placed instead of charging again.
const placed = globalThis.__mellaOrderRequests ?? (globalThis.__mellaOrderRequests = new Map());

export function createOrder({ userId, customer, items, requestId }) {
  const key = requestId ? `${userId}:${String(requestId).slice(0, 100)}` : null;
  if (key && placed.has(key)) return getOrder(placed.get(key));

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const order = {
    id: `MS-${randomBytes(4).toString('hex').toUpperCase()}`,
    userId,
    customer,
    items,
    subtotal,
    delivery: 0, // complimentary delivery within Addis Ababa
    total: subtotal,
    payment: { method: 'TeleBirr', status: 'paid', reference: `TB-${randomBytes(3).toString('hex').toUpperCase()}` },
    placedAt: new Date().toISOString(),
  };
  store.push(order);
  if (key) placed.set(key, order.id);
  return order;
}

export function getOrder(id) {
  return store.find((order) => order.id === id) ?? null;
}

// One account's orders, newest first. The user id must come from the verified session, never from
// the URL or a form, which is what stops one account listing another's orders.
export function getOrdersByUser(userId) {
  return store.filter((order) => order.userId === userId).reverse();
}

// What the owner sees: everything except the internal account id.
export function toPublicOrder(order) {
  const { userId, ...rest } = order;
  return rest;
}

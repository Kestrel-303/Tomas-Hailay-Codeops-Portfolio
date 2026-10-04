// In-memory order store. Kept on globalThis so dev hot reloads don't wipe it.
// Everything is lost when the server restarts.
const store = globalThis.__addisEatsOrders ?? (globalThis.__addisEatsOrders = []);

// There is no kitchen yet, so an order moves through these stages on a timer
// (seconds since it was placed). That gives the polling status screen something to show.
const STAGES = [
  { status: "placed", until: 15 },
  { status: "preparing", until: 45 },
  { status: "out-for-delivery", until: 90 },
  { status: "delivered", until: Infinity },
];

export const FINAL_STATUSES = ["delivered", "cancelled"];

function advance(order) {
  if (!order || FINAL_STATUSES.includes(order.status)) return order;
  const seconds = (Date.now() - new Date(order.placedAt).getTime()) / 1000;
  order.status = STAGES.find((stage) => seconds < stage.until).status;
  return order;
}

export function createOrder({ ownerId, name, phone, area, notes, items }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = {
    id: `AE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    ownerId,
    customer: { name, phone, area, notes },
    items,
    total,
    status: "placed",
    placedAt: new Date().toISOString(),
  };
  store.push(order);
  return order;
}

export function getOrderById(id) {
  return advance(store.find((order) => order.id === id));
}

export function getOrdersByOwner(ownerId) {
  return store
    .filter((order) => order.ownerId === ownerId)
    .map(advance)
    .reverse();
}

export function setOrderStatus(id, status) {
  const order = getOrderById(id);
  if (order) order.status = status;
  return order;
}

// What the client is allowed to see: everything except the owner's session id.
export function toPublicOrder(order) {
  const { ownerId, ...rest } = order;
  return rest;
}

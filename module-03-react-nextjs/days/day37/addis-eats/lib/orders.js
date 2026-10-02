// In-memory order store. Kept on globalThis so dev hot reloads don't wipe it.
// Everything is lost when the server restarts.
const store = globalThis.__addisEatsOrders ?? (globalThis.__addisEatsOrders = []);

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
  return store.find((order) => order.id === id);
}

export function getOrdersByOwner(ownerId) {
  return store.filter((order) => order.ownerId === ownerId).reverse();
}

export function setOrderStatus(id, status) {
  const order = getOrderById(id);
  if (order) order.status = status;
  return order;
}

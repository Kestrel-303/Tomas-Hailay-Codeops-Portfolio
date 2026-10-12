import Link from "next/link";
import { redirect } from "next/navigation";
import { formatETB } from "../../lib/money";
import { getOrdersByOwner } from "../../lib/orders";
import { getSession } from "../../lib/session";
import CancelOrderButton from "./CancelOrderButton";

export default async function OrdersPage() {
  // Scoped to the signed-in account: the owner id comes from the verified cookie, never from the
  // URL or a form field, so there's no parameter to change to see someone else's orders.
  const session = await getSession();
  if (!session) redirect("/sign-in?next=/orders");
  const orders = getOrdersByOwner(session.id);

  return (
    <div className="page" style={{ maxWidth: "640px" }}>
      <div className="page-header">
        <span className="eyebrow">Orders</span>
        <h1 className="page-title">My orders</h1>
        <p className="page-subtitle">Signed in as {session.name}.</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <h2 style={{ fontSize: "1.1rem" }}>No orders yet</h2>
          <Link href="/menu" className="btn btn-primary" style={{ marginTop: "1rem" }}>
            Browse the menu
          </Link>
        </div>
      ) : (
        <div className="cart-list">
          {orders.map((order) => (
            <div key={order.id} className="cart-item">
              <div className="cart-item-info">
                <Link href={`/orders/${order.id}`} className="dish-name">
                  {order.id}
                </Link>
                <span className="dish-category">
                  {order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}
                </span>
                <span className="dish-category">Status: {order.status}</span>
              </div>
              <div className="cart-item-total">
                <span className="dish-price">{formatETB(order.total)}</span>
                {order.status === "placed" && <CancelOrderButton orderId={order.id} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

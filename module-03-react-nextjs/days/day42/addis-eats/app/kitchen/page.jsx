import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAllOrders, toPublicOrder } from "../../lib/orders";
import { getSession } from "../../lib/session";

// Every customer's orders, so the role is checked here on the server before any data is read.
// Hiding the "Kitchen" link in the NavBar is only cosmetic: typing /kitchen into the address bar
// skips the markup entirely, and this check is what actually stops a customer.
export default async function KitchenPage() {
  const session = await getSession();
  if (!session) redirect("/sign-in?next=/kitchen");
  // A customer gets the same 404 as a page that doesn't exist, so the route isn't advertised.
  if (session.role !== "staff") notFound();

  const orders = getAllOrders()
    .filter((order) => order.status !== "delivered" && order.status !== "cancelled")
    .map(toPublicOrder);

  return (
    <div className="page" style={{ maxWidth: "720px" }}>
      <div className="page-header">
        <span className="eyebrow">Kitchen</span>
        <h1 className="page-title">Open orders</h1>
        <p className="page-subtitle">Signed in as {session.name} (staff).</p>
        <div className="actions-row">
          <Link href="/kitchen/reports" className="btn btn-secondary">
            Reports: revenue and orders, last 14 days
          </Link>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <h2 style={{ fontSize: "1.1rem" }}>No open orders</h2>
        </div>
      ) : (
        <div className="cart-list">
          {orders.map((order) => (
            <div key={order.id} className="cart-item">
              <div className="cart-item-info">
                <span className="dish-name">{order.id}</span>
                <span className="dish-category">
                  {order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}
                </span>
                <span className="dish-category">
                  {order.customer.name} · {order.customer.area}
                  {order.customer.notes && ` · "${order.customer.notes}"`}
                </span>
              </div>
              <div className="cart-item-total">
                <span className="dish-price">{order.status}</span>
                <span className="dish-category">{new Date(order.placedAt).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

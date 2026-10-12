import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById, toPublicOrder } from "../../../lib/orders";
import { getSession } from "../../../lib/session";
import OrderStatus from "./OrderStatus";
import { NO_INDEX } from "../../../lib/site";

export const metadata = {
  title: "Order status",
  description: "Where your Addis Eats order is right now, from placed to out for delivery. The page updates on its own.",
  robots: NO_INDEX,
};

// Server component: reads the order straight from the store, so the first paint already
// has real data. The client component takes it as SWR's fallbackData and polls from there.
export default async function OrderStatusPage({ params }) {
  const { id } = await params;
  const session = await getSession();
  const order = getOrderById(id);

  if (!session || !order || order.ownerId !== session.id) {
    notFound();
  }

  return (
    <div className="page" style={{ maxWidth: "640px" }}>
      <Link href="/orders" className="btn btn-ghost" style={{ marginBottom: "1.5rem", paddingLeft: 0 }}>
        ← All orders
      </Link>

      <div className="page-header">
        <span className="eyebrow">Order status</span>
        <h1 className="page-title">{order.id}</h1>
      </div>

      <OrderStatus orderId={order.id} fallbackData={toPublicOrder(order)} />
    </div>
  );
}

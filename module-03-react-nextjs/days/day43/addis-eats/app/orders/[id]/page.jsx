import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "../../../lib/orders";
import { getSession } from "../../../lib/session";
import { toTrackedOrder } from "../../../lib/tracking";
import OrderTracker from "./OrderTracker";

// Server component: reads the order straight from the store, so the first paint already has the
// real status and courier position. OrderTracker starts from that snapshot and then follows the
// live stream at /api/orders/[id]/stream.
export default async function OrderStatusPage({ params }) {
  const { id } = await params;
  const session = await getSession();
  const order = getOrderById(id);

  if (!session || !order || order.ownerId !== session.id) {
    notFound();
  }

  return (
    <div className="page" style={{ maxWidth: "720px" }}>
      <Link href="/orders" className="btn btn-ghost" style={{ marginBottom: "1.5rem", paddingLeft: 0 }}>
        ← All orders
      </Link>

      <div className="page-header">
        <span className="eyebrow">Order status</span>
        <h1 className="page-title">{order.id}</h1>
      </div>

      <OrderTracker initialOrder={toTrackedOrder(order)} />
    </div>
  );
}

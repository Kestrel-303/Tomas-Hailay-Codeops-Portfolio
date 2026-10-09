import { errorResponse } from "../../../../lib/api-errors";
import { getOrderById, toPublicOrder } from "../../../../lib/orders";
import { getSession } from "../../../../lib/session";

// Polled by the order-status screen, so it must never be cached.
export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const { id } = await params;

  const session = await getSession();
  if (!session) {
    return errorResponse(401, "UNAUTHORIZED", "Please sign in to view an order.");
  }

  const order = getOrderById(id);
  // Someone else's order gets the same 404 as a missing one, so ids can't be probed.
  if (!order || order.ownerId !== session.id) {
    return errorResponse(404, "NOT_FOUND", `No order with id "${id}".`);
  }

  return Response.json(toPublicOrder(order));
}

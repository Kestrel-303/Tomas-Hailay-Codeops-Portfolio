"use server";

import { revalidatePath } from "next/cache";
import { errorBody } from "../../lib/api-errors";
import { validateOrder } from "../../lib/order-schema";
import { createOrder, getOrderById, setOrderStatus } from "../../lib/orders";
import { getOrCreateSession, getSession } from "../../lib/session";

// Server actions can't set an HTTP status on their own, so each one returns a `status`
// field that mirrors what POST /api/orders would have sent. The form branches on it.

export async function placeOrder(_prevState, formData) {
  let items;
  try {
    items = JSON.parse(formData.get("items") ?? "[]");
  } catch {
    items = [];
  }

  const values = {
    name: formData.get("name") ?? "",
    phone: formData.get("phone") ?? "",
    area: formData.get("area") ?? "",
    notes: formData.get("notes") ?? "",
  };

  const result = validateOrder({ ...values, items });
  if (!result.success) {
    return {
      status: 422,
      ...errorBody("VALIDATION_FAILED", "Please correct the highlighted fields.", {
        fieldErrors: result.fieldErrors,
      }),
      values,
    };
  }

  try {
    const session = await getOrCreateSession();
    const order = createOrder({ ownerId: session.id, ...result.data });
    revalidatePath("/orders");
    return { status: 201, order };
  } catch {
    return { status: 500, ...errorBody("SERVER_ERROR", "Something went wrong placing your order."), values };
  }
}

export async function cancelOrder(_prevState, formData) {
  const orderId = formData.get("orderId");

  const session = await getSession();
  if (!session) {
    return { status: 401, ...errorBody("UNAUTHORIZED", "You need a session to cancel an order.") };
  }

  const order = getOrderById(orderId);
  if (!order) {
    return { status: 404, ...errorBody("NOT_FOUND", `No order with id "${orderId}".`) };
  }

  if (order.ownerId !== session.id) {
    return { status: 403, ...errorBody("FORBIDDEN", "You can only cancel your own orders.") };
  }

  if (order.status === "cancelled") {
    return { status: 409, ...errorBody("ALREADY_CANCELLED", "This order is already cancelled.") };
  }

  if (order.status !== "placed") {
    return { status: 409, ...errorBody("TOO_LATE", "The kitchen has already started on this order.") };
  }

  setOrderStatus(order.id, "cancelled");
  revalidatePath("/orders");
  return { status: 200 };
}

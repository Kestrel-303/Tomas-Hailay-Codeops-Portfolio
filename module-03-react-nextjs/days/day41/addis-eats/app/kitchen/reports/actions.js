"use server";

import { revalidatePath } from "next/cache";
import { addHistoricOrders, getAllOrders } from "../../../lib/orders";
import { buildSampleOrders } from "../../../lib/sample-orders";
import { getSession } from "../../../lib/session";

// Fills the empty store with 14 days of sample orders. Staff only, checked here because a
// server action is a public POST endpoint whether or not the button was shown.
export async function loadSampleOrders() {
  const session = await getSession();
  if (session?.role !== "staff") return;

  // Once is enough: a second click would double every day's numbers.
  if (getAllOrders().some((order) => order.ownerId === "sample")) return;

  addHistoricOrders(buildSampleOrders());
  revalidatePath("/kitchen/reports");
}

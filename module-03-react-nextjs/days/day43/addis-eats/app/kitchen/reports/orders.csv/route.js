import { errorResponse } from "../../../../lib/api-errors";
import { toCsv } from "../../../../lib/csv";
import { when } from "../../../../lib/format";
import { getAllOrders } from "../../../../lib/orders";
import { CSV_COLUMNS, ordersInRange, readTableParams, sortOrders } from "../../../../lib/reports";
import { getSession } from "../../../../lib/session";

export const dynamic = "force-dynamic";

// GET /kitchen/reports/orders.csv?sort=total&dir=desc: every order in the report's 14 days, in
// the same order as the table. A route handler doesn't run the reports layout, so it checks the
// staff role itself.
export async function GET(request) {
  const session = await getSession();
  if (!session) return errorResponse(401, "UNAUTHORIZED", "Please sign in as staff to export orders.");
  if (session.role !== "staff") return errorResponse(404, "NOT_FOUND", "Not found.");

  const now = new Date();
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const orders = sortOrders(ordersInRange(getAllOrders(), now), readTableParams(params));

  // A byte-order mark first, so Excel reads the file as UTF-8 and "×" (and any Amharic name)
  // doesn't turn into mojibake. Sheets and LibreOffice ignore it.
  const body = "﻿" + toCsv(CSV_COLUMNS, orders);

  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="addis-eats-orders-${when(now, "day-key")}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

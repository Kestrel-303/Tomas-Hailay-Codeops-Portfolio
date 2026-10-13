import { when } from "./format";

// Turns raw orders into what the reports page shows. Runs on the server only: the page passes
// the browser a 14-row daily summary, never the orders themselves (no names, phones or ids).

export const REPORT_DAYS = 14;
export const PAGE_SIZE = 10;

// Days are Addis Ababa calendar days (when(date, "day-key") from lib/format.js), so an order at
// 01:00 local counts on the right day.

// Cancelled orders earned nothing, so they're left out of revenue and order counts alike.
const counts = (order) => order.status !== "cancelled";

export function summarizeByDay(orders, now = new Date()) {
  const days = [];
  for (let i = REPORT_DAYS - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 86_400_000);
    days.push({ key: when(date, "day-key"), label: when(date, "day"), revenue: 0, orders: 0 });
  }
  const byKey = new Map(days.map((day) => [day.key, day]));

  for (const order of orders) {
    const day = byKey.get(when(order.placedAt, "day-key"));
    if (!day || !counts(order)) continue;
    day.revenue += order.total;
    day.orders += 1;
  }

  const first = new Date(now.getTime() - (REPORT_DAYS - 1) * 86_400_000);
  return {
    days,
    // e.g. "26 Sep – 9 Oct 2026", used in every heading so the range is never implied.
    rangeLabel: `${when(first, "day")} – ${when(now, "day-year")}`,
    totalRevenue: days.reduce((sum, day) => sum + day.revenue, 0),
    totalOrders: days.reduce((sum, day) => sum + day.orders, 0),
  };
}

// The orders placed inside the same 14 days the charts cover, cancelled ones included (the
// table lists them with their status; the charts leave them out).
export function ordersInRange(orders, now = new Date()) {
  const first = when(now.getTime() - (REPORT_DAYS - 1) * 86_400_000, "day-key");
  const last = when(now, "day-key");
  return orders.filter((order) => {
    const key = when(order.placedAt, "day-key");
    return key >= first && key <= last;
  });
}

// The order table's columns. `value` is what sorting compares; only these keys are accepted
// from the URL, so ?sort=anything-else falls back to the default instead of erroring.
export const COLUMNS = {
  placed: { label: "Placed", value: (o) => new Date(o.placedAt).getTime(), firstDir: "desc" },
  customer: { label: "Customer", value: (o) => o.customer.name.toLowerCase(), firstDir: "asc" },
  status: { label: "Status", value: (o) => o.status, firstDir: "asc" },
  items: { label: "Items", value: (o) => o.items.reduce((n, item) => n + item.quantity, 0), firstDir: "desc", numeric: true },
  total: { label: "Total", value: (o) => o.total, firstDir: "desc", numeric: true },
};

export function readTableParams(searchParams) {
  const sort = COLUMNS[searchParams.sort] ? searchParams.sort : "placed";
  const dir = searchParams.dir === "asc" || searchParams.dir === "desc" ? searchParams.dir : COLUMNS[sort].firstDir;
  const page = Math.max(1, Number.parseInt(searchParams.page, 10) || 1);
  return { sort, dir, page };
}

// Shared by the table and the CSV export, so the download comes out in the order on screen.
export function sortOrders(orders, { sort, dir }) {
  const value = COLUMNS[sort].value;
  return [...orders].sort((a, b) => {
    const diff = value(a) < value(b) ? -1 : value(a) > value(b) ? 1 : 0;
    // Ties keep a stable, newest-first order so paging never shuffles rows between pages.
    return (dir === "asc" ? diff : -diff) || new Date(b.placedAt) - new Date(a.placedAt);
  });
}

export function pageOfOrders(orders, { sort, dir, page }) {
  const sorted = sortOrders(orders, { sort, dir });
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = sorted.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE).map((o) => ({
    id: o.id,
    placed: when(o.placedAt),
    placedIso: o.placedAt,
    customer: o.customer.name,
    area: o.customer.area,
    status: o.status,
    items: COLUMNS.items.value(o),
    total: o.total,
  }));
  return { rows, page: current, pageCount, totalRows: sorted.length };
}

// The CSV export's columns: every order in the range, not just one page. Free text (names, notes
// and the item list) can hold commas and quotes; lib/csv.js quotes those cells. Totals are plain
// numbers under an "(ETB)" header, and times are "2026-10-13 14:05", so a spreadsheet can sum
// and sort them. No phone numbers: a staff report doesn't need them.
export const CSV_COLUMNS = [
  { label: "Order", value: (o) => o.id },
  { label: "Placed (Addis Ababa time)", value: (o) => when(o.placedAt, "sortable") },
  { label: "Customer", value: (o) => o.customer.name },
  { label: "Neighbourhood", value: (o) => o.customer.area },
  { label: "Delivery notes", value: (o) => o.customer.notes ?? "" },
  { label: "Status", value: (o) => o.status },
  { label: "Items", value: (o) => o.items.map((item) => `${item.name} × ${item.quantity}`).join(", ") },
  { label: "Item count", value: (o) => COLUMNS.items.value(o) },
  { label: "Total (ETB)", value: (o) => o.total },
];

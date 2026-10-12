// Turns raw orders into what the reports page shows. Runs on the server only: the page passes
// the browser a 14-row daily summary, never the orders themselves (no names, phones or ids).

export const REPORT_DAYS = 14;
export const PAGE_SIZE = 10;
const TIME_ZONE = "Africa/Addis_Ababa";

// "2026-10-09" in Addis Ababa time, so an order at 01:00 local counts on the right day.
const dayKey = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" });
const shortDay = new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, day: "numeric", month: "short" });
const longDay = new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, day: "numeric", month: "short", year: "numeric" });
const dateTime = new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

// Cancelled orders earned nothing, so they're left out of revenue and order counts alike.
const counts = (order) => order.status !== "cancelled";

export function summarizeByDay(orders, now = new Date()) {
  const days = [];
  for (let i = REPORT_DAYS - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 86_400_000);
    days.push({ key: dayKey.format(date), label: shortDay.format(date), revenue: 0, orders: 0 });
  }
  const byKey = new Map(days.map((day) => [day.key, day]));

  for (const order of orders) {
    const day = byKey.get(dayKey.format(new Date(order.placedAt)));
    if (!day || !counts(order)) continue;
    day.revenue += order.total;
    day.orders += 1;
  }

  const first = new Date(now.getTime() - (REPORT_DAYS - 1) * 86_400_000);
  return {
    days,
    // e.g. "26 Sep – 9 Oct 2026", used in every heading so the range is never implied.
    rangeLabel: `${shortDay.format(first)} – ${longDay.format(now)}`,
    totalRevenue: days.reduce((sum, day) => sum + day.revenue, 0),
    totalOrders: days.reduce((sum, day) => sum + day.orders, 0),
  };
}

// The orders placed inside the same 14 days the charts cover, cancelled ones included (the
// table lists them with their status; the charts leave them out).
export function ordersInRange(orders, now = new Date()) {
  const first = dayKey.format(new Date(now.getTime() - (REPORT_DAYS - 1) * 86_400_000));
  const last = dayKey.format(now);
  return orders.filter((order) => {
    const key = dayKey.format(new Date(order.placedAt));
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

export function pageOfOrders(orders, { sort, dir, page }) {
  const value = COLUMNS[sort].value;
  const sorted = [...orders].sort((a, b) => {
    const diff = value(a) < value(b) ? -1 : value(a) > value(b) ? 1 : 0;
    // Ties keep a stable, newest-first order so paging never shuffles rows between pages.
    return (dir === "asc" ? diff : -diff) || new Date(b.placedAt) - new Date(a.placedAt);
  });
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = sorted.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE).map((o) => ({
    id: o.id,
    placed: dateTime.format(new Date(o.placedAt)),
    placedIso: o.placedAt,
    customer: o.customer.name,
    area: o.customer.area,
    status: o.status,
    items: COLUMNS.items.value(o),
    total: o.total,
  }));
  return { rows, page: current, pageCount, totalRows: sorted.length };
}

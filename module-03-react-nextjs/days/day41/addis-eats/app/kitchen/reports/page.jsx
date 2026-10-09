import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { formatETB } from "../../../lib/money";
import { getAllOrders } from "../../../lib/orders";
import { ordersInRange, pageOfOrders, readTableParams, summarizeByDay } from "../../../lib/reports";
import { getSession } from "../../../lib/session";
import { loadSampleOrders } from "./actions";
import OrderTable from "./OrderTable";
import OrdersChart from "./OrdersChart";
import RevenueChart from "./RevenueChart";

export const metadata = { title: "Reports · Addis Eats" };

// The four states this page can be in, and how to force each one from the address bar:
//   empty      no orders in the last 14 days    (a fresh server, or ?state=empty)
//   loading    loading.jsx while this renders   (?state=loading adds a 3s delay)
//   error      error.jsx with a Try again        (?state=error throws)
//   populated  charts and tables                 (the normal case once orders exist)
export default async function ReportsPage({ searchParams }) {
  const session = await getSession();
  if (!session) redirect("/sign-in?next=/kitchen/reports");
  if (session.role !== "staff") notFound();

  const params = await searchParams;
  if (params.state === "loading") await new Promise((resolve) => setTimeout(resolve, 3000));
  if (params.state === "error") throw new Error("Forced error: the reports could not be loaded (?state=error).");

  // Aggregation happens here, on the server. The chart components get `summary.days`, 14 small
  // rows of { label, revenue, orders }, never the orders with names, phones and areas.
  const now = new Date();
  const orders = params.state === "empty" ? [] : ordersInRange(getAllOrders(), now);
  const summary = summarizeByDay(orders, now);

  if (orders.length === 0) return <EmptyState rangeLabel={summary.rangeLabel} forced={params.state === "empty"} />;

  const table = pageOfOrders(orders, readTableParams(params));
  const hrefFor = ({ sort, dir, page }) => `/kitchen/reports?${new URLSearchParams({ sort, dir, page: String(page) })}`;

  return (
    <div className="page">
      <Header rangeLabel={summary.rangeLabel} />

      <div className="stat-row">
        <div className="card stat">
          <span className="stat-label">Revenue</span>
          <strong className="stat-value">{formatETB(summary.totalRevenue)}</strong>
        </div>
        <div className="card stat">
          <span className="stat-label">Orders</span>
          <strong className="stat-value">{summary.totalOrders}</strong>
        </div>
        <div className="card stat">
          <span className="stat-label">Average order</span>
          <strong className="stat-value">
            {formatETB(summary.totalOrders ? Math.round(summary.totalRevenue / summary.totalOrders) : 0)}
          </strong>
        </div>
      </div>

      <section className="card report-section" aria-labelledby="revenue-heading">
        <h2 id="revenue-heading" className="report-heading">
          Revenue per day <span className="muted">· {summary.rangeLabel} · ETB</span>
        </h2>
        <RevenueChart days={summary.days} />
      </section>

      <section className="card report-section" aria-labelledby="orders-heading">
        <h2 id="orders-heading" className="report-heading">
          Orders per day <span className="muted">· {summary.rangeLabel} · number of orders</span>
        </h2>
        <OrdersChart days={summary.days} />

        {/* The same numbers as both charts, for anyone who can't see the SVG (screen readers,
            high-contrast modes) or who wants exact values. Visible, not hidden: it helps everyone. */}
        <details className="chart-data" open>
          <summary>Daily figures as a table</summary>
          <div className="table-scroll">
            <table className="data-table">
              <caption>Revenue (ETB) and number of orders per day, {summary.rangeLabel}. Cancelled orders are not counted.</caption>
              <thead>
                <tr>
                  <th scope="col">Day</th>
                  <th scope="col" className="num">Orders</th>
                  <th scope="col" className="num">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {summary.days.map((day) => (
                  <tr key={day.key}>
                    <th scope="row">
                      <time dateTime={day.key}>{day.label}</time>
                    </th>
                    <td className="num">{day.orders}</td>
                    <td className="num">{formatETB(day.revenue)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">Total</th>
                  <td className="num">{summary.totalOrders}</td>
                  <td className="num">{formatETB(summary.totalRevenue)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </details>
      </section>

      <section className="card report-section" aria-labelledby="table-heading">
        <h2 id="table-heading" className="report-heading">
          Orders <span className="muted">· {summary.rangeLabel}</span>
        </h2>
        <OrderTable {...table} {...readTableParams(params)} page={table.page} rangeLabel={summary.rangeLabel} hrefFor={hrefFor} />
      </section>
    </div>
  );
}

function Header({ rangeLabel }) {
  return (
    <div className="page-header">
      <Link href="/kitchen" className="eyebrow">← Kitchen</Link>
      <h1 className="page-title">Reports</h1>
      <p className="page-subtitle">The last 14 days, {rangeLabel}. Times are Addis Ababa time.</p>
    </div>
  );
}

// Built first, before there was any data. It says why it's empty and what to do about it,
// instead of drawing two flat charts and an empty table.
function EmptyState({ rangeLabel, forced }) {
  return (
    <div className="page">
      <Header rangeLabel={rangeLabel} />
      <div className="empty-state">
        <h2 style={{ fontSize: "1.1rem" }}>No orders in the last 14 days</h2>
        <p className="page-subtitle" style={{ maxWidth: "460px", margin: "0.5rem auto 0" }}>
          Revenue and order charts appear here once orders come in. Orders are kept in memory, so a
          server restart clears them.
        </p>
        {forced ? (
          <p className="page-subtitle" style={{ marginTop: "1rem" }}>
            Forced with <code>?state=empty</code>. <Link href="/kitchen/reports">Show the real data</Link>
          </p>
        ) : (
          <form action={loadSampleOrders} style={{ marginTop: "1.25rem" }}>
            <button type="submit" className="btn btn-primary">Load 14 days of sample orders</button>
          </form>
        )}
      </div>
    </div>
  );
}

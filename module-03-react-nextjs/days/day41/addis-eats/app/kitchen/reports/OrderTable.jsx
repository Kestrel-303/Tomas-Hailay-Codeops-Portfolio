import Link from "next/link";
import { COLUMNS } from "../../../lib/reports";
import { formatETB } from "../../../lib/money";

// Server component: real <table> markup with a caption, column headers with scope, sort links
// in the headers and right-aligned numbers. Everything is driven by the URL, so a sorted,
// paged view can be bookmarked, shared, and works with JavaScript off.
export default function OrderTable({ rows, sort, dir, page, pageCount, totalRows, rangeLabel, hrefFor }) {
  return (
    <>
      <div className="table-scroll">
        <table className="data-table">
          <caption>
            Orders placed {rangeLabel}, sorted by {COLUMNS[sort].label.toLowerCase()} ({dir === "asc" ? "ascending" : "descending"}).
            Page {page} of {pageCount}, {totalRows} {totalRows === 1 ? "order" : "orders"} in total.
          </caption>
          <thead>
            <tr>
              <th scope="col">Order</th>
              {Object.entries(COLUMNS).map(([key, column]) => {
                const active = key === sort;
                // Clicking the active column flips it; another column starts in its natural order.
                const nextDir = active ? (dir === "asc" ? "desc" : "asc") : column.firstDir;
                return (
                  <th
                    key={key}
                    scope="col"
                    className={column.numeric ? "num" : undefined}
                    // Only the column the table is actually sorted by carries aria-sort.
                    aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : undefined}
                  >
                    {/* Sorting starts again from page 1, since the old page number means nothing in a new order. */}
                    <Link href={hrefFor({ sort: key, dir: nextDir, page: 1 })} className="sort-link">
                      {column.label}
                      <span aria-hidden="true" className="sort-icon">
                        {active ? (dir === "asc" ? "▲" : "▼") : "↕"}
                      </span>
                    </Link>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <th scope="row" className="mono">{row.id}</th>
                <td>
                  <time dateTime={row.placedIso}>{row.placed}</time>
                </td>
                <td>
                  {row.customer} <span className="muted">· {row.area}</span>
                </td>
                <td>
                  <span className={`status-pill status-${row.status}`}>{row.status}</span>
                </td>
                <td className="num">{row.items}</td>
                <td className="num">{formatETB(row.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pager page={page} pageCount={pageCount} hrefFor={(n) => hrefFor({ sort, dir, page: n })} />
    </>
  );
}

// Real links, so every page has its own URL and Back/Forward work. The current page is marked
// with aria-current; Previous/Next are plain text (not links) at either end.
function Pager({ page, pageCount, hrefFor }) {
  if (pageCount <= 1) return null;
  return (
    <nav className="pager" aria-label="Order table pages">
      {page > 1 ? <Link href={hrefFor(page - 1)} rel="prev">← Previous</Link> : <span aria-disabled="true">← Previous</span>}
      <ol>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
          <li key={n}>
            {n === page ? (
              <span aria-current="page">{n}</span>
            ) : (
              <Link href={hrefFor(n)} aria-label={`Page ${n}`}>{n}</Link>
            )}
          </li>
        ))}
      </ol>
      {page < pageCount ? <Link href={hrefFor(page + 1)} rel="next">Next →</Link> : <span aria-disabled="true">Next →</span>}
    </nav>
  );
}

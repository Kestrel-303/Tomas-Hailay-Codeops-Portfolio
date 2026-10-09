"use client";

import Link from "next/link";

// Error boundaries must be client components. In production Next replaces the real message with
// a generic one (only `digest` gets through), so the details stay in the server log.
export default function ReportsError({ error, reset }) {
  return (
    <div className="page">
      <div className="page-header">
        <span className="eyebrow">Kitchen</span>
        <h1 className="page-title">Reports</h1>
      </div>
      <div className="empty-state" role="alert">
        <h2 style={{ fontSize: "1.1rem" }}>The reports couldn&apos;t be loaded</h2>
        <p className="page-subtitle" style={{ marginTop: "0.5rem" }}>
          Nothing was changed. Try again, and if it keeps failing, check the server log
          {error?.digest ? ` (reference ${error.digest})` : ""}.
        </p>
        <div className="actions-row" style={{ justifyContent: "center", marginTop: "1rem" }}>
          <button type="button" className="btn btn-primary" onClick={reset}>
            Try again
          </button>
          <Link href="/kitchen/reports" className="btn btn-ghost">
            Back to reports
          </Link>
        </div>
      </div>
    </div>
  );
}

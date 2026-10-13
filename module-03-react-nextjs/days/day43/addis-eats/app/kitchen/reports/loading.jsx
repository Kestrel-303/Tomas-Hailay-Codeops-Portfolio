// Shown while the reports page renders on the server. The skeleton boxes are the same height as
// the real chart boxes, so nothing moves when the data arrives.
export default function ReportsLoading() {
  return (
    <div className="page" aria-busy="true">
      <div className="page-header">
        <span className="eyebrow">Kitchen</span>
        <h1 className="page-title">Reports</h1>
        <p className="page-subtitle" role="status">Loading the last 14 days…</p>
      </div>
      <div className="stat-row">
        {[1, 2, 3].map((n) => (
          <div key={n} className="card stat skeleton" style={{ height: "88px" }} />
        ))}
      </div>
      {[1, 2].map((n) => (
        <div key={n} className="card report-section">
          <div className="skeleton" style={{ height: "1.4rem", width: "60%", marginBottom: "1rem" }} />
          <div className="chart-box skeleton" />
        </div>
      ))}
    </div>
  );
}

import Link from "next/link";

// The site-wide 404. Unknown dish ids land here too: menu/[id] sets dynamicParams = false, so
// Next answers them with a real 404 before the menu segment renders.
export default function NotFound() {
  return (
    <div className="page">
      <div className="status-card" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <span className="status-icon" aria-hidden="true">
          🍽️
        </span>
        <h1 className="page-title">Page not found</h1>
        <p className="page-subtitle">There&apos;s nothing at this address. The dish or page may have been removed, or the link is mistyped.</p>
        <div className="actions-row" style={{ justifyContent: "center" }}>
          <Link href="/menu" className="btn btn-primary">
            Browse the menu
          </Link>
          <Link href="/home" className="btn btn-ghost">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

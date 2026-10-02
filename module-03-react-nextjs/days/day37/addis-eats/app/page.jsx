import Link from "next/link";

export default function RootPage() {
  return (
    <div className="page">
      <div className="status-card" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <span className="eyebrow">Welcome</span>
        <h1 className="page-title">Addis Eats</h1>
        <p className="page-subtitle" style={{ maxWidth: "40ch" }}>
          Ethiopian home cooking, delivered. Browse the menu, build a cart, and check out in minutes.
        </p>
        <div className="actions-row">
          <Link href="/home" className="btn btn-primary">
            Get started
          </Link>
          <Link href="/menu" className="btn btn-secondary">
            Browse the menu
          </Link>
        </div>
      </div>
    </div>
  );
}

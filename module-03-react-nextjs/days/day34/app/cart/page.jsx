import Link from "next/link";

export default function CartPage() {
  return (
    <div className="page">
      <div className="page-header">
        <span className="eyebrow">Cart</span>
        <h1 className="page-title">Your cart</h1>
      </div>

      <div className="empty-state">
        <span className="empty-state-icon" aria-hidden="true">
          🛒
        </span>
        <h2 style={{ fontSize: "1.1rem" }}>Your cart is empty</h2>
        <p className="page-subtitle">Head back to the menu to add a few dishes.</p>
        <Link href="/menu" className="btn btn-primary" style={{ marginTop: "1rem" }}>
          Browse the menu
        </Link>
      </div>
    </div>
  );
}

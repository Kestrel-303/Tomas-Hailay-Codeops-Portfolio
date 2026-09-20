import Link from "next/link";

export default function CheckoutPage() {
  return (
    <div className="page" style={{ maxWidth: "560px" }}>
      <div className="page-header">
        <span className="eyebrow">Checkout</span>
        <h1 className="page-title">Checkout</h1>
        <p className="page-subtitle">Placeholder checkout form goes here.</p>
      </div>

      <div className="card">
        <p className="page-subtitle">This step will collect delivery details and payment.</p>
        <Link href="/cart" className="btn btn-secondary" style={{ marginTop: "1.25rem" }}>
          Back to cart
        </Link>
      </div>
    </div>
  );
}

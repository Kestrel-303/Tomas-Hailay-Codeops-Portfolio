import Link from "next/link";
import { cookies } from "next/headers";

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  return (
    <div className="page" style={{ maxWidth: "560px" }}>
      <div className="page-header">
        <span className="eyebrow">Checkout</span>
        <h1 className="page-title">Checkout</h1>
        <p className="page-subtitle">
          {sessionToken ? `Session: ${sessionToken}` : "Complete your order by confirming your delivery address and payment."}
        </p>
      </div>

      <div className="card">
        <p className="page-subtitle">Ready to place your order? Confirm your cart items before completing checkout.</p>
        <Link href="/cart" className="btn btn-secondary" style={{ marginTop: "1.25rem" }}>
          Back to cart
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "../../lib/session";
import CheckoutForm from "./CheckoutForm";

export default async function CheckoutPage() {
  const session = await getSession();
  if (!session) redirect("/sign-in?next=/checkout");

  return (
    <div className="page" style={{ maxWidth: "560px" }}>
      <div className="page-header">
        <span className="eyebrow">Checkout</span>
        <h1 className="page-title">Checkout</h1>
        <p className="page-subtitle">
          Signed in as {session.name}. Confirm your delivery details to place the order.
        </p>
      </div>

      <CheckoutForm />

      <Link href="/cart" className="btn btn-secondary" style={{ marginTop: "1.25rem" }}>
        Back to cart
      </Link>
    </div>
  );
}

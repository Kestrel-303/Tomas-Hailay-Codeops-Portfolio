import Link from "next/link";

export default function CheckoutPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Checkout</h1>
      <p>Placeholder checkout form goes here.</p>
      <Link href="/cart">Back to cart</Link>
    </div>
  );
}

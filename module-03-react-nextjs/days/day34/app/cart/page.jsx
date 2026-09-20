import Link from "next/link";

export default function CartPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Cart</h1>
      <p>Your cart is empty. Head back to the menu to add dishes.</p>
      <Link href="/menu">Back to menu</Link>
    </div>
  );
}

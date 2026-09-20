import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Home</h1>
      <p>Welcome to Addis Eats. Browse the menu and place an order.</p>
      <Link href="/menu">Browse the menu</Link>
    </div>
  );
}

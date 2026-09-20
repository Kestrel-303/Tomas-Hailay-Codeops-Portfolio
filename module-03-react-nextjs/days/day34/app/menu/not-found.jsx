import Link from "next/link";

export default function MenuNotFound() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dish not found</h1>
      <p>We couldn&apos;t find a dish with that id.</p>
      <Link href="/menu">Back to menu</Link>
    </div>
  );
}

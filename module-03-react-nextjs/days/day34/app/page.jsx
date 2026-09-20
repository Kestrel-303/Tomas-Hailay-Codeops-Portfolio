import Link from "next/link";

export default function RootPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Addis Eats</h1>
      <p>
        Go to <Link href="/home">Home</Link> to get started.
      </p>
    </div>
  );
}

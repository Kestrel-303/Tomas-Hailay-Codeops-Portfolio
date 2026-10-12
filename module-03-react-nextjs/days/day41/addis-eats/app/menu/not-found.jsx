import Link from "next/link";
import { NO_INDEX } from "../../lib/site";

export const metadata = {
  title: "Dish not found",
  description: "That dish isn't on the Addis Eats menu. Head back to the full menu to pick another.",
  robots: NO_INDEX,
};

export default function MenuNotFound() {
  return (
    <div className="page">
      <div className="status-card" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <span className="status-icon" aria-hidden="true">
          🍽️
        </span>
        <h1 className="page-title">Dish not found</h1>
        <p className="page-subtitle">We couldn&apos;t find a dish with that id.</p>
        <Link href="/menu" className="btn btn-primary">
          Back to menu
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import { dishes } from "../../lib/dishes";
import LayoutCounter from "./LayoutCounter";

export default function MenuLayout({ children }) {
  const categories = [...new Set(dishes.map((dish) => dish.category))];

  return (
    <div className="page">
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap" }}>
        <aside
          style={{
            width: "220px",
            padding: "1.25rem",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            flexShrink: 0,
          }}
        >
          <LayoutCounter />

          <h4 style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
            Categories
          </h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <li>
              <Link href="/menu" style={{ fontSize: "0.9rem", color: "var(--text)" }}>
                All Dishes
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat}>
                <Link
                  href={`/menu?category=${encodeURIComponent(cat)}`}
                  style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <section style={{ flex: 1, minWidth: "280px" }}>{children}</section>
      </div>
    </div>
  );
}


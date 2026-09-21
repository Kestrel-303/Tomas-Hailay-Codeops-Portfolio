"use client";

import { useState } from "react";
import Link from "next/link";
import { dishes } from "../../lib/dishes";

export default function MenuLayout({ children }) {
  const [count, setCount] = useState(0);
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
          <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>Menu Layout</h3>
          
          <div
            style={{
              padding: "0.75rem",
              background: "var(--bg-elevated)",
              borderRadius: "var(--radius-sm)",
              marginBottom: "1.25rem",
            }}
          >
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
              Layout Counter: <strong style={{ color: "var(--accent)" }}>{count}</strong>
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: "0.25rem 0.6rem", fontSize: "0.8rem" }}
                onClick={() => setCount(count + 1)}
              >
                +
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: "0.25rem 0.6rem", fontSize: "0.8rem" }}
                onClick={() => setCount(count - 1)}
              >
                -
              </button>
            </div>
          </div>

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

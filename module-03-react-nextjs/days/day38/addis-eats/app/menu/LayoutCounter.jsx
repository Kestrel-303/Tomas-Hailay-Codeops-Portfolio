"use client";

import { useState } from "react";

export default function LayoutCounter() {
  const [count, setCount] = useState(0);

  return (
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
  );
}

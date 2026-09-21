"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import DishList from "./DishList";

export default function MenuDishes({ dishes }) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const simulateError = searchParams.get("error") === "true";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [category, simulateError]);

  if (loading) {
    return <div className="skeleton" style={{ height: "180px", borderRadius: "var(--radius)" }} />;
  }

  if (simulateError) {
    throw new Error("Failed to load the menu. Please try again.");
  }

  const visibleDishes = category ? dishes.filter((dish) => dish.category === category) : dishes;

  if (visibleDishes.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon" aria-hidden="true">
          🍽️
        </span>
        <h2 style={{ fontSize: "1.1rem" }}>No dishes in this category</h2>
        <p className="page-subtitle">Try a different category.</p>
      </div>
    );
  }

  return <DishList dishes={visibleDishes} />;
}

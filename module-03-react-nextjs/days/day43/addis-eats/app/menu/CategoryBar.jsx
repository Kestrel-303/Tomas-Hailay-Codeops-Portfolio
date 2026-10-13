"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CategoryBar({ categories }) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  return (
    <div className="pill-row" role="tablist" aria-label="Filter dishes by category">
      <Link
        href="/menu"
        className={`pill${!activeCategory ? " active" : ""}`}
        aria-current={!activeCategory ? "true" : undefined}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          href={`/menu?category=${encodeURIComponent(category)}`}
          className={`pill${activeCategory === category ? " active" : ""}`}
          aria-current={activeCategory === category ? "true" : undefined}
        >
          {category}
        </Link>
      ))}
    </div>
  );
}

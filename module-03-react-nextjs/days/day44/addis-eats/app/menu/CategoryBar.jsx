"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Category filters are links (each one is its own URL), so they sit in a <nav>, and the current
// one is marked with aria-current="page". This used to claim role="tablist", which promises
// arrow-key tab behaviour that plain links don't have.
export default function CategoryBar({ categories }) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  return (
    <nav className="pill-row" aria-label="Filter dishes by category">
      <Link
        href="/menu"
        className={`pill${!activeCategory ? " active" : ""}`}
        aria-current={!activeCategory ? "page" : undefined}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          href={`/menu?category=${encodeURIComponent(category)}`}
          className={`pill${activeCategory === category ? " active" : ""}`}
          aria-current={activeCategory === category ? "page" : undefined}
        >
          {category}
        </Link>
      ))}
    </nav>
  );
}

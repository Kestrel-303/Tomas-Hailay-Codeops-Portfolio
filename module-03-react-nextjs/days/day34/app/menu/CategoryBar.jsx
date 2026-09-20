import Link from "next/link";

export default function CategoryBar({ categories, activeCategory }) {
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

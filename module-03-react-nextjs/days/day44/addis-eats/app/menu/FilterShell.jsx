"use client";

import CategoryBar from "./CategoryBar";

export default function FilterShell({ categories, children }) {
  return (
    <div className="filter-shell">
      <CategoryBar categories={categories} />
      {children}
    </div>
  );
}

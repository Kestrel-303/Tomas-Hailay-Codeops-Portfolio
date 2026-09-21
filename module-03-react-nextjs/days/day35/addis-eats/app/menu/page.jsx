import { Suspense } from "react";
import { dishes } from "../../lib/dishes";
import CategoryBar from "./CategoryBar";
import MenuDishes from "./MenuDishes";

export const revalidate = 60;

const categories = [...new Set(dishes.map((dish) => dish.category))];

export default function MenuPage() {
  return (
    <div>
      <div className="page-header">
        <span className="eyebrow">Menu</span>
        <h1 className="page-title">Our dishes</h1>
        <p className="page-subtitle">Pick a category, tap a dish to see details, and add it to your cart.</p>
      </div>
      <Suspense fallback={<div className="pill-row" />}>
        <CategoryBar categories={categories} />
      </Suspense>
      <Suspense fallback={<div className="skeleton" style={{ height: "180px", borderRadius: "var(--radius)" }} />}>
        <MenuDishes dishes={dishes} />
      </Suspense>
    </div>
  );
}

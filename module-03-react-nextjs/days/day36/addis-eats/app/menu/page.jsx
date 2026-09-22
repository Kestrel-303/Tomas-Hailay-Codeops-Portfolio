import { getDishes } from "../../lib/dishes";
import FilterShell from "./FilterShell";
import DishList from "./DishList";

export const revalidate = 60;

export default async function MenuPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const category = resolvedParams?.category;
  const dishes = await getDishes();

  const visibleDishes = category
    ? dishes.filter((dish) => dish.category === category)
    : dishes;
  const categories = [...new Set(dishes.map((dish) => dish.category))];

  return (
    <div>
      <div className="page-header">
        <span className="eyebrow">Menu</span>
        <h1 className="page-title">Our dishes</h1>
        <p className="page-subtitle">
          Pick a category, tap a dish to see details, and add it to your cart.
        </p>
      </div>
      <FilterShell categories={categories}>
        {visibleDishes.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon" aria-hidden="true">
              🍽️
            </span>
            <h2 style={{ fontSize: "1.1rem" }}>No dishes in this category</h2>
            <p className="page-subtitle">Try a different category.</p>
          </div>
        ) : (
          <DishList dishes={visibleDishes} />
        )}
      </FilterShell>
    </div>
  );
}

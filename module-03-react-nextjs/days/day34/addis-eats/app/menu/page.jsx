import { dishes } from "../../lib/dishes";
import CategoryBar from "./CategoryBar";
import DishList from "./DishList";

const categories = [...new Set(dishes.map((dish) => dish.category))];

// Simulates a data fetch so loading.jsx has something to show, and lets
// error.jsx be verified on demand via the ?error=true query param.
async function getDishes(simulateError) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (simulateError) {
    throw new Error("Failed to load the menu. Please try again.");
  }

  return dishes;
}

export default async function MenuPage({ searchParams }) {
  const { error, category } = await searchParams;
  const menu = await getDishes(error === "true");
  const visibleDishes = category ? menu.filter((dish) => dish.category === category) : menu;

  return (
    <div className="page">
      <div className="page-header">
        <span className="eyebrow">Menu</span>
        <h1 className="page-title">Our dishes</h1>
        <p className="page-subtitle">Pick a category, tap a dish to see details, and add it to your cart.</p>
      </div>
      <CategoryBar categories={categories} activeCategory={category} />
      {visibleDishes.length > 0 ? (
        <DishList dishes={visibleDishes} />
      ) : (
        <div className="empty-state">
          <span className="empty-state-icon" aria-hidden="true">
            🍽️
          </span>
          <h2 style={{ fontSize: "1.1rem" }}>No dishes in this category</h2>
          <p className="page-subtitle">Try a different category.</p>
        </div>
      )}
    </div>
  );
}

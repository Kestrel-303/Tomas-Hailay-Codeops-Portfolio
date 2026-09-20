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
  const { error } = await searchParams;
  const menu = await getDishes(error === "true");

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Menu</h1>
      <CategoryBar categories={categories} />
      <DishList dishes={menu} />
    </div>
  );
}

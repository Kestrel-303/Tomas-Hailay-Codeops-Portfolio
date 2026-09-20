import { dishes } from "../../lib/dishes";
import CategoryBar from "./CategoryBar";
import DishList from "./DishList";

const categories = [...new Set(dishes.map((dish) => dish.category))];

export default function MenuPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Menu</h1>
      <CategoryBar categories={categories} />
      <DishList dishes={dishes} />
    </div>
  );
}

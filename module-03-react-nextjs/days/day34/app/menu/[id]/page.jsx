import Link from "next/link";
import { notFound } from "next/navigation";
import { getDishById } from "../../../lib/dishes";

export default async function DishPage({ params }) {
  const { id } = await params;
  const dish = getDishById(id);

  if (!dish) {
    notFound();
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{dish.name}</h1>
      <p>Dish id: {id}</p>
      <p>Category: {dish.category}</p>
      <p>Price: ${dish.price}</p>
      <Link href="/menu">Back to menu</Link>
    </div>
  );
}

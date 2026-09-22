import Link from "next/link";

export default function DishList({ dishes }) {
  return (
    <div className="dish-grid">
      {dishes.map((dish) => (
        <Link key={dish.id} href={`/menu/${dish.id}`} className="dish-card">
          <div className="dish-card-top">
            <span className="dish-name">{dish.name}</span>
            <span className="dish-price">${dish.price}</span>
          </div>
          <span className="dish-category">{dish.category}</span>
        </Link>
      ))}
    </div>
  );
}

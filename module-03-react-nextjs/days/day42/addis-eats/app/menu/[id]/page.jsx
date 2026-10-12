import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DISH_PHOTO, dishes, getDishById } from "../../../lib/dishes";
import { formatETB } from "../../../lib/money";
import AddToCartButton from "./AddToCartButton";

export async function generateStaticParams() {
  return dishes.map((dish) => ({
    id: dish.id,
  }));
}

export default async function DishPage({ params }) {
  const { id } = await params;
  const dish = getDishById(id);

  if (!dish) {
    notFound();
  }

  return (
    <div style={{ maxWidth: "640px" }}>
      <Link href="/menu" className="btn btn-ghost" style={{ marginBottom: "1.5rem", paddingLeft: 0 }}>
        ← Back to menu
      </Link>

      <Image
        src={`/images/dishes/${dish.id}.jpg`}
        alt={dish.name}
        {...DISH_PHOTO}
        // The detail column is at most 640px wide.
        sizes="(max-width: 704px) calc(100vw - 2rem), 640px"
        className="dish-photo"
        style={{ marginBottom: "1.25rem" }}
      />

      <span className="eyebrow">{dish.category}</span>
      <h1 className="page-title">{dish.name}</h1>

      <div className="detail-list">
        <div className="detail-row">
          <span className="detail-row-label">Dish id</span>
          <span>{id}</span>
        </div>
        <div className="detail-row">
          <span className="detail-row-label">Category</span>
          <span>{dish.category}</span>
        </div>
        <div className="detail-row">
          <span className="detail-row-label">Price</span>
          <span>{formatETB(dish.price)}</span>
        </div>
      </div>

      <AddToCartButton dish={dish} />
    </div>
  );
}

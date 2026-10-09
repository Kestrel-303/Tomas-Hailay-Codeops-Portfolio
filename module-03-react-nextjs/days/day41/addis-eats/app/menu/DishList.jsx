import Image from "next/image";
import Link from "next/link";
import { DISH_CARD_SIZES, DISH_PHOTO } from "../../lib/dishes";
import { formatETB } from "../../lib/money";

export default function DishList({ dishes }) {
  return (
    <div className="dish-grid">
      {dishes.map((dish) => (
        <Link key={dish.id} href={`/menu/${dish.id}`} className="dish-card">
          <Image
            src={`/images/dishes/${dish.id}.jpg`}
            alt={dish.name}
            {...DISH_PHOTO}
            sizes={DISH_CARD_SIZES}
            className="dish-photo"
          />
          <div className="dish-card-top">
            <span className="dish-name">{dish.name}</span>
            <span className="dish-price">{formatETB(dish.price)}</span>
          </div>
          <span className="dish-category">{dish.category}</span>
        </Link>
      ))}
    </div>
  );
}

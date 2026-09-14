import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";

export default function DishCard({ dish }) {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const isWished = wishlist.includes(dish.id);

  return (
    <article className="dish-card">
      <Link to={`/dish/${dish.id}`} className="dish-card__media" style={{ background: dish.color }}>
        <span className="dish-card__emoji">{dish.emoji}</span>
        <button
          type="button"
          className={`wish-btn ${isWished ? "wish-btn--active" : ""}`}
          onClick={e => {
            e.preventDefault();
            toggleWishlist(dish.id);
          }}
          aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWished ? "♥" : "♡"}
        </button>
      </Link>

      <div className="dish-card__body">
        <Link to={`/dish/${dish.id}`} className="dish-card__title">
          <h3>{dish.name}</h3>
        </Link>
        <p className="dish-card__meta">
          <span className="pill">{dish.category}</span>
          <span className="rating">⭐ {dish.rating}</span>
        </p>
        <div className="dish-card__footer">
          <span className="price">{dish.price} ETB</span>
          <button type="button" className="btn btn--sm" onClick={() => addToCart(dish.id)}>
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

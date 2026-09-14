import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import DishCard from "../components/DishCard";

export default function DishDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dishes, addToCart, toggleWishlist, wishlist } = useShop();
  const [qty, setQty] = useState(1);

  const dish = dishes.find(d => d.id === Number(id));

  if (!dish) {
    return (
      <div className="page">
        <p>Dish not found.</p>
        <Link to="/" className="btn">Back to Menu</Link>
      </div>
    );
  }

  const isWished = wishlist.includes(dish.id);
  const related = dishes.filter(d => d.category === dish.category && d.id !== dish.id).slice(0, 3);

  return (
    <div className="page">
      <button type="button" className="link-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="dish-detail">
        <div className="dish-detail__media" style={{ background: dish.color }}>
          <span className="dish-detail__emoji">{dish.emoji}</span>
        </div>

        <div className="dish-detail__info">
          <p className="pill">{dish.category}</p>
          <h1>{dish.name}</h1>
          <p className="rating">⭐ {dish.rating} &bull; {dish.prepTime} min prep</p>
          <p className="dish-detail__desc">{dish.description}</p>

          {dish.tags.length > 0 && (
            <div className="tag-row">
              {dish.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          )}

          <p className="spicy-row">
            Spice level: {"🌶️".repeat(dish.spicy) || "None"}
          </p>

          <p className="price price--lg">{dish.price} ETB</p>

          <div className="dish-detail__actions">
            <div className="qty-stepper">
              <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
              <span>{qty}</span>
              <button type="button" onClick={() => setQty(q => q + 1)} aria-label="Increase quantity">+</button>
            </div>
            <button type="button" className="btn" onClick={() => addToCart(dish.id, qty)}>
              Add {qty} to Cart — {dish.price * qty} ETB
            </button>
            <button
              type="button"
              className={`btn btn--outline ${isWished ? "btn--wished" : ""}`}
              onClick={() => toggleWishlist(dish.id)}
            >
              {isWished ? "♥ In Wishlist" : "♡ Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="section-title">You might also like</h2>
          <div className="dish-grid">
            {related.map(d => (
              <DishCard key={d.id} dish={d} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

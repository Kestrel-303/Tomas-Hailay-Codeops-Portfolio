import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCartStore } from "../../stores/useCartStore";
import { useWishlistStore } from "../../stores/useWishlistStore";
import { useAuth } from "../../context/AuthContext";
import QuickViewModal from "./QuickViewModal";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { id, title, brand, price, thumbnail } = product;
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(id));
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleWishlistClick = (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    toggleWishlist(product);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${id}`} className="product-card__image-wrap">
        <img src={thumbnail} alt={title} loading="lazy" />
        <button
          type="button"
          className={
            isInWishlist ? "product-card__wishlist is-active" : "product-card__wishlist"
          }
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isInWishlist}
          onClick={handleWishlistClick}
        >
          {isInWishlist ? "♥" : "♡"}
        </button>
        <button
          type="button"
          className="product-card__quick-view"
          onClick={(event) => {
            event.preventDefault();
            setQuickViewOpen(true);
          }}
        >
          Quick View
        </button>
      </Link>
      <Link to={`/product/${id}`}>
        <p className="product-card__brand">{brand}</p>
        <h3 className="product-card__title">{title}</h3>
      </Link>
      <div className="product-card__footer">
        <p className="product-card__price">${price.toFixed(2)}</p>
        <button type="button" className="product-card__add" onClick={() => addItem(product)}>
          Add to Bag
        </button>
      </div>

      {quickViewOpen && (
        <QuickViewModal
          product={product}
          onClose={() => setQuickViewOpen(false)}
          onAddToCart={(item) => {
            addItem(item);
            setQuickViewOpen(false);
          }}
        />
      )}
    </div>
  );
}

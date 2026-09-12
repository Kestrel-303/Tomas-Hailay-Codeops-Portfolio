import { createPortal } from "react-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./QuickViewModal.css";

export default function QuickViewModal({ product, onClose, onAddToCart }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div className="quick-view__overlay" onClick={onClose}>
      <div
        className="quick-view__panel"
        role="dialog"
        aria-modal="true"
        aria-label={product.title}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="quick-view__close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="quick-view__image-wrap">
          <img src={product.thumbnail} alt={product.title} />
        </div>

        <div className="quick-view__info">
          <p className="page-section__eyebrow">{product.brand}</p>
          <h2 className="quick-view__title">{product.title}</h2>
          <p className="quick-view__price">${product.price.toFixed(2)}</p>
          <p className="quick-view__description">{product.description}</p>

          <div className="quick-view__actions">
            <button type="button" className="btn btn-solid" onClick={() => onAddToCart(product)}>
              Add to Bag
            </button>
            <Link to={`/product/${product.id}`} className="btn" onClick={onClose}>
              View Full Details
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

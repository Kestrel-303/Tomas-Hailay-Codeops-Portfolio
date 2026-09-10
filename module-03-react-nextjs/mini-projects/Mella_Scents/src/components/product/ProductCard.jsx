import { Link } from "react-router-dom";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { id, title, brand, price, thumbnail } = product;

  return (
    <Link to={`/product/${id}`} className="product-card">
      <div className="product-card__image-wrap">
        <img src={thumbnail} alt={title} loading="lazy" />
      </div>
      <p className="product-card__brand">{brand}</p>
      <h3 className="product-card__title">{title}</h3>
      <p className="product-card__price">${price.toFixed(2)}</p>
    </Link>
  );
}

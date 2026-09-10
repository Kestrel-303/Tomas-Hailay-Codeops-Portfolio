import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { endpoints } from "../lib/api";
import { LoadingMessage, ErrorMessage } from "../components/common/StatusMessage";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { productId } = useParams();
  const { data: product, loading, error } = useFetch(endpoints.fragrance(productId));

  if (loading) {
    return (
      <section className="page-section container">
        <LoadingMessage label="Loading fragrance…" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-section container">
        <ErrorMessage message={error} />
      </section>
    );
  }

  return (
    <section className="page-section container product-detail">
      <div className="product-detail__image-wrap">
        <img src={product.thumbnail} alt={product.title} />
      </div>
      <div className="product-detail__info">
        <p className="page-section__eyebrow">{product.brand}</p>
        <h1 className="page-section__title">{product.title}</h1>
        <p className="product-detail__price">${product.price.toFixed(2)}</p>
        <p className="page-section__body">{product.description}</p>
      </div>
    </section>
  );
}

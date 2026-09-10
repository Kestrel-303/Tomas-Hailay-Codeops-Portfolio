import { useParams } from "react-router-dom";

export default function ProductDetail() {
  const { productId } = useParams();

  return (
    <section className="page-section container">
      <p className="page-section__eyebrow">Fragrance</p>
      <h1 className="page-section__title">Product #{productId}</h1>
      <p className="page-section__body">
        Product data, imagery, and the quick-view modal arrive in a later stage.
      </p>
    </section>
  );
}

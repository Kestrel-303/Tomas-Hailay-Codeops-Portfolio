import useFetch from "../hooks/useFetch";
import { endpoints } from "../lib/api";
import ProductGrid from "../components/product/ProductGrid";
import { LoadingMessage, ErrorMessage, EmptyMessage } from "../components/common/StatusMessage";

export default function Shop() {
  const { data, loading, error } = useFetch(endpoints.fragrances);
  const products = data?.products ?? [];

  return (
    <section className="page-section container">
      <p className="page-section__eyebrow">The Collection</p>
      <h1 className="page-section__title">Shop All Fragrances</h1>

      {loading && <LoadingMessage />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && products.length === 0 && <EmptyMessage />}
      {!loading && !error && products.length > 0 && <ProductGrid products={products} />}
    </section>
  );
}

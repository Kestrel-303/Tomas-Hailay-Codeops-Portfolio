import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { endpoints } from "../lib/api";
import ProductGrid from "../components/product/ProductGrid";
import { LoadingMessage, ErrorMessage } from "../components/common/StatusMessage";
import "./Home.css";

export default function Home() {
  const { data, loading, error } = useFetch(endpoints.fragrances);
  const featured = (data?.products ?? []).slice(0, 4);

  return (
    <>
      <section className="home-hero">
        <div className="container home-hero__inner">
          <p className="home-hero__eyebrow">Est. Fragrance House</p>
          <h1 className="home-hero__title">Mella Scents</h1>
          <p className="home-hero__subtitle">
            Minimal bottles. Maximal presence. Discover fragrances composed for quiet
            confidence.
          </p>
          <Link to="/shop" className="btn btn-solid">
            Explore the Collection
          </Link>
        </div>
      </section>

      <section className="page-section container">
        <p className="page-section__eyebrow">Featured</p>
        <h2 className="page-section__title">New Arrivals</h2>

        {loading && <LoadingMessage />}
        {error && <ErrorMessage message={error} />}
        {!loading && !error && <ProductGrid products={featured} />}
      </section>
    </>
  );
}

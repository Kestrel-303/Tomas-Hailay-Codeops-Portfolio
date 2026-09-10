import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
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
  );
}

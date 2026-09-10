import { Link } from "react-router-dom";
import { useWishlistStore } from "../stores/useWishlistStore";
import ProductGrid from "../components/product/ProductGrid";

export default function Wishlist() {
  const items = useWishlistStore((state) => state.items);

  return (
    <section className="page-section container">
      <p className="page-section__eyebrow">Saved</p>
      <h1 className="page-section__title">Wishlist</h1>

      {items.length === 0 ? (
        <div className="empty-state">
          <p className="page-section__body">You haven't saved any fragrances yet.</p>
          <Link to="/shop" className="btn btn-solid">
            Explore the Collection
          </Link>
        </div>
      ) : (
        <ProductGrid products={items} />
      )}
    </section>
  );
}

import Link from "next/link";
import { dishes } from "../../lib/dishes";

export default function HomePage() {
  const featured = dishes.slice(0, 3);

  return (
    <div className="page">
      <div className="page-header">
        <span className="eyebrow">Home</span>
        <h1 className="page-title">What are you craving today?</h1>
        <p className="page-subtitle">Fresh Ethiopian dishes made to order, ready to browse and add to your cart.</p>
        <div className="actions-row">
          <Link href="/menu" className="btn btn-primary">
            Browse the full menu
          </Link>
        </div>
      </div>

      <h2 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Popular right now</h2>
      <div className="dish-grid">
        {featured.map((dish) => (
          <Link key={dish.id} href={`/menu/${dish.id}`} className="dish-card">
            <div className="dish-card-top">
              <span className="dish-name">{dish.name}</span>
              <span className="dish-price">${dish.price}</span>
            </div>
            <span className="dish-category">{dish.category}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

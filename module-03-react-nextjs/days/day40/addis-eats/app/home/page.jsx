import Image from "next/image";
import Link from "next/link";
import { DISH_CARD_SIZES, DISH_PHOTO, dishes } from "../../lib/dishes";

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

      <div className="hero">
        <Image
          src="/images/hero.jpg"
          alt="A spread of Ethiopian dishes on injera"
          width={2400}
          height={1200}
          // Full content width: viewport minus page padding, capped by the 1040px page.
          sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1040px) calc(100vw - 3rem), 992px"
          className="hero-image"
          // The one image that gets priority: it's the largest thing above the fold on /home and
          // Lighthouse's LCP element. It's preloaded and not lazy. Every other image stays lazy.
          priority
        />
      </div>

      <h2 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Popular right now</h2>
      <div className="dish-grid">
        {featured.map((dish) => (
          <Link key={dish.id} href={`/menu/${dish.id}`} className="dish-card">
            <Image
              src={`/images/dishes/${dish.id}.jpg`}
              alt={dish.name}
              {...DISH_PHOTO}
              sizes={DISH_CARD_SIZES}
              className="dish-photo"
            />
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

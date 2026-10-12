import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DISH_PHOTO, dishes, getDishById } from "../../../lib/dishes";
import { absoluteUrl } from "../../../lib/site";
import AddToCartButton from "./AddToCartButton";

export async function generateStaticParams() {
  return dishes.map((dish) => ({
    id: dish.id,
  }));
}

// Built from the dish's name, price and summary, so every dish page has its own title and
// description, and both match what the page shows.
export async function generateMetadata({ params }) {
  const { id } = await params;
  const dish = getDishById(id);
  if (!dish) return { title: "Dish not found" };

  const description = `${dish.summary} $${dish.price} at Addis Eats.`;
  return {
    title: `${dish.name} · $${dish.price}`,
    description,
    // og:image is this folder's opengraph-image.jsx, a card generated for this dish.
    openGraph: { title: dish.name, description, url: `/menu/${dish.id}` },
  };
}

// schema.org MenuItem, made from the same `dish` object the page renders below: name from the
// h1, price from the Price row, description from the summary paragraph.
function menuItemJsonLd(dish) {
  return {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: dish.summary,
    url: absoluteUrl(`/menu/${dish.id}`),
    image: absoluteUrl(`/images/dishes/${dish.id}.jpg`),
    offers: {
      "@type": "Offer",
      price: String(dish.price),
      priceCurrency: "USD",
    },
  };
}

export default async function DishPage({ params }) {
  const { id } = await params;
  const dish = getDishById(id);

  if (!dish) {
    notFound();
  }

  return (
    <div style={{ maxWidth: "640px" }}>
      <script
        type="application/ld+json"
        // Escaping "<" keeps any value from closing the script tag early.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuItemJsonLd(dish)).replace(/</g, "\\u003c") }}
      />
      <Link href="/menu" className="btn btn-ghost" style={{ marginBottom: "1.5rem", paddingLeft: 0 }}>
        ← Back to menu
      </Link>

      <Image
        src={`/images/dishes/${dish.id}.jpg`}
        alt={dish.name}
        {...DISH_PHOTO}
        // The detail column is at most 640px wide.
        sizes="(max-width: 704px) calc(100vw - 2rem), 640px"
        className="dish-photo"
        style={{ marginBottom: "1.25rem" }}
      />

      <span className="eyebrow">{dish.category}</span>
      <h1 className="page-title">{dish.name}</h1>
      <p className="page-subtitle" style={{ marginBottom: "1.25rem" }}>{dish.summary}</p>

      <div className="detail-list">
        <div className="detail-row">
          <span className="detail-row-label">Dish id</span>
          <span>{id}</span>
        </div>
        <div className="detail-row">
          <span className="detail-row-label">Category</span>
          <span>{dish.category}</span>
        </div>
        <div className="detail-row">
          <span className="detail-row-label">Price</span>
          <span>${dish.price}</span>
        </div>
      </div>

      <AddToCartButton dish={dish} />
    </div>
  );
}

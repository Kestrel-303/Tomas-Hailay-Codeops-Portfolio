import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getDishById, getAllDishes } from '@/lib/dishes';
import { DISH_PHOTO, dishPhotoAlt, dishPhotoSrc } from '@/lib/dish-photos';
import { NO_INDEX, absoluteUrl } from '@/lib/site';
import AddToCartButton from '../../AddToCartButton';

export async function generateStaticParams() {
  const dishes = getAllDishes();
  return dishes.map((dish) => ({
    id: dish.id,
  }));
}

// Everything here comes from the dish record, so each dish page gets its own title and
// description, and they can never disagree with what the page shows.
export async function generateMetadata({ params }) {
  const { id } = await params;
  const dish = getDishById(id);
  if (!dish) return { title: 'Dish not found', robots: NO_INDEX };

  const description = dishDescription(dish);
  return {
    title: `${dish.name} · ${dish.priceFormatted}`,
    description,
    alternates: { canonical: `/menu/${dish.id}` },
    // og:image comes from ./opengraph-image.js (a 1200×630 card generated for this dish).
    openGraph: { title: `${dish.name} · ${dish.amharicName}`, description, url: `/menu/${dish.id}` },
  };
}

// The dish's own description, cut to fit, plus the facts someone deciding what to order wants:
// price, spice and whether it's a fasting dish. Whole sentences are added until they'd overflow
// (so a very short first sentence like Doro Wat's still gives a full description), and only a
// first sentence that is too long on its own is trimmed at a word. 160 characters at most.
function dishDescription(dish) {
  const facts = `${dish.priceFormatted}, ${dish.spiceLevel.replace(/[^\p{L}\p{N}\s-]/gu, '').trim().toLowerCase()}${dish.isFasting ? ', fasting-friendly' : ''}.`;
  const room = 160 - facts.length - 1;
  const sentences = dish.description.match(/[^.!?]+[.!?]+/g)?.map((s) => s.trim()) ?? [dish.description];

  let lead = '';
  let used = 0;
  for (const sentence of sentences) {
    const next = lead ? `${lead} ${sentence}` : sentence;
    if (next.length > room) break;
    lead = next;
    used += 1;
  }
  // Too short to say much ("The iconic Ethiopian national dish.")? Add as much of the next
  // sentence as fits, cut at a word.
  const cut = (text, max) => `${text.slice(0, max - 1).replace(/\s+\S*$/, '').replace(/[,;:]$/, '')}…`;
  if (lead.length < 90 && sentences[used]) {
    const space = room - (lead ? lead.length + 1 : 0);
    lead = lead ? `${lead} ${cut(sentences[used], space)}` : cut(sentences[used], space);
  }
  return `${lead} ${facts}`;
}

// schema.org MenuItem for this dish. name and price are the same fields the page renders
// ({dish.name}, {dish.priceFormatted} = `${dish.price} ETB`), so the structured data can't
// drift from what a visitor sees.
function menuItemJsonLd(dish) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MenuItem',
    '@id': absoluteUrl(`/menu/${dish.id}#menu-item`),
    name: dish.name,
    alternateName: dish.amharicName,
    description: dish.description,
    url: absoluteUrl(`/menu/${dish.id}`),
    image: absoluteUrl(dishPhotoSrc(dish)),
    ...(dish.isFasting && { suitableForDiet: 'https://schema.org/VeganDiet' }),
    offers: {
      '@type': 'Offer',
      price: String(dish.price),
      priceCurrency: 'ETB',
      availability: 'https://schema.org/InStock',
      url: absoluteUrl(`/menu/${dish.id}`),
    },
  };
}

export default async function DishDetailPage({ params }) {
  const { id } = await params;
  const dish = getDishById(id);

  if (!dish) {
    notFound();
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <script
        type="application/ld+json"
        // JSON.stringify doesn't escape "<", so a "</script>" inside any value could end the tag
        // early. Escaping it keeps the JSON valid and the page safe.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuItemJsonLd(dish)).replace(/</g, '\\u003c') }}
      />

      {/* Back to Menu Link */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/menu" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} id="back-to-menu-link">
          &larr; Back to Full Menu
        </Link>
      </div>

      <div className="card" style={{ padding: '2.5rem' }}>
        {/* Header Section */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <div
            className="dish-icon-header"
            style={{ width: '160px', height: '160px', fontSize: '5rem', margin: 0, flexShrink: 0 }}
          >
            {/* The photo box is a fixed 160×160 square. */}
            <Image src={dishPhotoSrc(dish)} alt={dishPhotoAlt(dish)} {...DISH_PHOTO} sizes="160px" className="dish-photo" />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-gold">{dish.category}</span>
              <span className={`badge ${dish.isFasting ? 'badge-green' : 'badge-gold'}`}>
                {dish.isFasting ? 'Fasting 🌱' : 'Traditional 🥩'}
              </span>
              <span className="badge badge-red">{dish.spiceLevel}</span>
            </div>

            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1.2 }}>{dish.name}</h1>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--accent-gold)', margin: '0.25rem 0 1rem' }}>
              {dish.amharicName}
            </h2>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-gold)' }}>
              {dish.priceFormatted}
            </div>
          </div>
        </div>

        <hr style={{ borderColor: 'var(--border-color)', margin: '1.5rem 0' }} />

        {/* Description */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>About this Dish</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7' }}>
            {dish.description}
          </p>
        </div>

        {/* Ingredients List */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Key Ingredients & Spices</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {dish.ingredients.map((ing, idx) => (
              <span
                key={idx}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.9rem',
                }}
              >
                {ing}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
          <AddToCartButton dish={dish} className="btn btn-primary" style={{ flex: 1, padding: '1rem' }} id="add-to-cart-btn">
            🛒 Add to Cart
          </AddToCartButton>
          <Link href="/checkout" className="btn btn-secondary" style={{ padding: '1rem 1.5rem' }} id="quick-checkout-btn">
            Quick Checkout &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

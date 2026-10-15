import Link from 'next/link';
import { notFound } from 'next/navigation';
import AddToBagButton from '@/components/AddToBagButton';
import ProductGrid from '@/components/ProductGrid';
import Rating from '@/components/Rating';
import WishlistButton from '@/components/WishlistButton';
import { etb } from '@/lib/money';
import { getProduct, getProducts } from '@/lib/products';
import { absoluteUrl } from '@/lib/site';
import Gallery from './Gallery';

// Every fragrance id is known at build time, so each page is prerendered and refreshed hourly
// with the catalogue. Any other id is a real 404 straight away (dynamicParams = false), instead
// of a page rendered on demand that could only say "not found" inside a 200 response.
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ id: product.slug }));
}
export const dynamicParams = false;
export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: 'Fragrance not found' };
  const description = `${product.title} by ${product.brand}, ${etb(product.price)}. ${product.description}`.slice(0, 160);
  return {
    title: `${product.title} by ${product.brand}`,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    // The product's own photo is the link-preview card.
    openGraph: { title: `${product.title} · Mella Scents`, description, url: `/product/${product.slug}`, images: [{ url: product.image, width: 1000, height: 1000, alt: product.title }] },
    twitter: { card: 'summary_large_image', images: [product.image] },
  };
}

// schema.org Product, built from the same fields the page shows, so the price in search results
// can't disagree with the page. "<" is escaped so the JSON can't close the <script> tag.
function productJsonLd(product) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    brand: { '@type': 'Brand', name: product.brand },
    description: product.description,
    sku: product.sku,
    image: product.images.map((src) => absoluteUrl(src)),
    url: absoluteUrl(`/product/${product.slug}`),
    aggregateRating: product.reviews.length ? { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviews.length } : undefined,
    offers: {
      '@type': 'Offer',
      price: String(product.price),
      priceCurrency: 'ETB',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: absoluteUrl(`/product/${product.slug}`),
    },
  }).replace(/</g, '\\u003c');
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();
  const others = (await getProducts()).filter((p) => p.slug !== product.slug).slice(0, 4);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: productJsonLd(product) }} />
      <section className="page-section container product-detail">
        <Gallery images={product.images} title={product.title} />

        <div className="product-detail__info">
          <Link href="/shop" className="link-back">
            ← Back to the collection
          </Link>
          <p className="page-section__eyebrow">{product.brand}</p>
          <h1 className="page-section__title">{product.title}</h1>
          <Rating value={product.rating} />
          <p className="product-detail__price">{etb(product.price)}</p>
          <p className="page-section__body">{product.description}</p>

          <p className={`stock${product.stock < 10 ? ' stock--low' : ''}`}>
            {product.stock < 1 ? 'Sold out' : product.stock < 10 ? `Only ${product.stock} left` : 'In stock'}
          </p>

          <div className="product-detail__actions">
            <AddToBagButton product={product} />
            <WishlistButton product={product} className="btn btn-icon" />
          </div>

          <dl className="product-detail__facts">
            <div>
              <dt>Delivery</dt>
              <dd>Complimentary across Addis Ababa. {product.shipping}.</dd>
            </div>
            <div>
              <dt>Returns</dt>
              <dd>{product.returnPolicy}.</dd>
            </div>
            <div>
              <dt>SKU</dt>
              <dd>{product.sku}</dd>
            </div>
          </dl>
        </div>
      </section>

      {product.reviews.length > 0 && (
        <section className="container reviews" aria-labelledby="reviews-title">
          <h2 id="reviews-title" className="reviews__title">
            What wearers say
          </h2>
          <ul className="reviews__list">
            {product.reviews.map((review) => (
              <li key={`${review.name}-${review.date}`} className="review">
                <Rating value={review.rating} />
                <p className="review__comment">“{review.comment}”</p>
                <p className="review__name">{review.name}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="page-section container" aria-labelledby="more-title">
        <h2 id="more-title" className="page-section__title">
          You may also like
        </h2>
        <ProductGrid products={others} />
      </section>
    </>
  );
}

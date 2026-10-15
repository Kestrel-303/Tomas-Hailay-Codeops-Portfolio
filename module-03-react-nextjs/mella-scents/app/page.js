import Link from 'next/link';
import ProductGrid from '@/components/ProductGrid';
import { getFeatured } from '@/lib/products';

// ISR: the page is built once and rebuilt at most hourly, when the catalogue might have changed.
// Every visitor gets the cached HTML with the products already in it (the Vite version fetched
// them in the browser and showed "Loading fragrances…" first).
export const revalidate = 3600;

export default async function HomePage() {
  const featured = await getFeatured(4);

  return (
    <>
      <section className="home-hero">
        <div className="container home-hero__inner">
          <p className="home-hero__eyebrow">Est. Fragrance House · Addis Ababa</p>
          <h1 className="home-hero__title">Mella Scents</h1>
          <p className="home-hero__subtitle">Minimal bottles. Maximal presence. Discover fragrances composed for quiet confidence.</p>
          <div className="home-hero__actions">
            <Link href="/shop" className="btn btn-solid">
              Explore the Collection
            </Link>
            <Link href="/about" className="btn">
              Our Story
            </Link>
          </div>
        </div>
      </section>

      <section className="page-section container" aria-labelledby="featured-title">
        <div className="section-head">
          <div>
            <p className="page-section__eyebrow">Featured</p>
            <h2 id="featured-title" className="page-section__title">
              Most Loved
            </h2>
          </div>
          <Link href="/shop" className="link-arrow">
            Shop all fragrances →
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>

      <section className="container promises" aria-label="Why Mella Scents">
        <div className="promise">
          <h3>Complimentary delivery</h3>
          <p>Anywhere in Addis Ababa, from Bole to Piassa, at no extra cost.</p>
        </div>
        <div className="promise">
          <h3>Pay with TeleBirr</h3>
          <p>Every price is in birr, and you pay exactly what you see.</p>
        </div>
        <div className="promise">
          <h3>Authentic houses</h3>
          <p>Chanel, Dior, Gucci, Calvin Klein and Dolce &amp; Gabbana.</p>
        </div>
      </section>
    </>
  );
}

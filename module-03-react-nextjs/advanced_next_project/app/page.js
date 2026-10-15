import Image from 'next/image';
import Link from 'next/link';
import { getAllDishes } from '@/lib/dishes';
import { DISH_CARD_SIZES, DISH_PHOTO, dishPhotoAlt, dishPhotoSrc } from '@/lib/dish-photos';
import { etb } from '@/lib/format';
import AddToCartButton from './AddToCartButton';

// title.absolute skips the "%s · Addis Eats" template: the home page leads with the brand.
export const metadata = {
  title: { absolute: 'Addis Eats · Ethiopian food delivered in Addis Ababa' },
  description:
    'Order doro wat, kitfo, tibs and fasting platters from Addis Eats, freshly cooked and delivered across Addis Ababa. Pay with Telebirr, CBE Birr or cash.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  const popularDishes = getAllDishes().filter((d) => d.popular).slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <Image
          // Served from public/images (a 2400px copy of the Wikimedia Commons original). Hotlinked, the
          // image optimizer's requests to upload.wikimedia.org were refused with 429 Too Many Requests,
          // which left a broken image on wide screens.
          src="/images/hero-injera.jpg"
          alt="A fasting platter on injera: yellow split-pea stew, collard greens, beetroot and potato-carrot alicha"
          width={2400}
          height={1602}
          // Full hero width: the 1200px page minus main and hero padding (5rem in total).
          sizes="(max-width: 1200px) calc(100vw - 5rem), 1120px"
          className="hero-image"
          // No `preload` (Next 16's `priority`) here, on purpose. The LCP element on this page is the
          // h1, not this photo, and preloading the photo put ~50 KB on the critical path ahead of
          // the text: removing it took Lighthouse from 76 to 91 (see PERF.md).
        />
        <p className="hero-credit">
          Photo:{' '}
          <a href="https://commons.wikimedia.org/wiki/File:Injera,_Fasting_Food,_Ethiopia_(11286899826).jpg">Rod Waddington</a>,{' '}
          <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC BY-SA 2.0</a>, via Wikimedia Commons
        </p>
        <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>
          ✨ Premier Ethiopian Kitchen
        </span>
        <h1 className="hero-title">
          Authentic Ethiopian Flavors,<br />Delivered Hot & Fresh
        </h1>
        <p className="hero-subtitle">
          Experience slow-simmered Doro Wat, spiced Kitfo, and rich Yetsom Beyaynetu prepared with traditional spices and fresh teff injera.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/menu" className="btn btn-primary" id="hero-menu-cta">
            Explore Full Menu 🍲
          </Link>
          <Link href="/cart" className="btn btn-secondary" id="hero-cart-cta">
            View Order Cart 🛒
          </Link>
        </div>
      </section>

      {/* Featured Dishes Section */}
      <section style={{ marginTop: '3rem' }}>
        <div className="section-head">
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Popular Signature Dishes</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Handpicked favorites from our traditional kitchen</p>
          </div>
          <Link href="/menu" className="btn btn-secondary" style={{ fontSize: '0.9rem' }} id="home-view-all-link">
            View All Dishes &rarr;
          </Link>
        </div>

        <div className="dish-grid">
          {popularDishes.map((dish) => (
            <div key={dish.id} className="card dish-card">
              <div className="dish-icon-header">
                <Image src={dishPhotoSrc(dish)} alt={dishPhotoAlt(dish)} {...DISH_PHOTO} sizes={DISH_CARD_SIZES} className="dish-photo" />
                <span className="badge badge-gold" style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  {dish.spiceLevel}
                </span>
              </div>
              <div className="dish-info">
                <div className="dish-title-row">
                  <h3 className="dish-title">{dish.name}</h3>
                </div>
                <div className="dish-amharic">{dish.amharicName}</div>
                <p className="dish-desc">{dish.description}</p>

                <div className="dish-footer">
                  <span className="dish-price">{etb(dish.price)}</span>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <Link href={`/menu/${dish.id}`} className="btn btn-secondary" style={{ padding: '0.5rem 0.9rem', fontSize: '0.875rem' }} id={`featured-view-${dish.id}`}>
                      View Details
                    </Link>
                    <AddToCartButton dish={dish} className="btn btn-primary" style={{ padding: '0.5rem 0.85rem', fontSize: '0.875rem' }} id={`featured-add-${dish.id}`}>
                      Add to Cart
                    </AddToCartButton>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

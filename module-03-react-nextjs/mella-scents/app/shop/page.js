import { Suspense } from 'react';
import ProductGrid from '@/components/ProductGrid';
import { getProducts } from '@/lib/products';
import ShopView from './ShopView';

export const revalidate = 3600;

export const metadata = {
  title: 'Shop All Fragrances',
  description: 'The full Mella Scents collection with prices in birr: search by fragrance or house and filter by price.',
  // The search and price filter live in the query string; search engines should see one page.
  alternates: { canonical: '/shop' },
};

// The page stays static (cached, ISR) even though it filters: reading searchParams here would make
// it render on every request. The server renders every product once; ShopView reads ?q= and ?max=
// in the browser and filters. While it loads, and without JavaScript, the full grid shows.
export default async function ShopPage() {
  const products = await getProducts();
  const maxPrice = Math.max(...products.map((product) => product.price));

  return (
    <section className="page-section container">
      <p className="page-section__eyebrow">The Collection</p>
      <h1 className="page-section__title">Shop All Fragrances</h1>
      <Suspense fallback={<ProductGrid products={products} eagerFirst />}>
        <ShopView products={products} maxPrice={maxPrice} />
      </Suspense>
    </section>
  );
}

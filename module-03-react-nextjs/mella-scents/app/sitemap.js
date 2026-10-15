import { getProducts } from '@/lib/products';
import { SITE_URL } from '@/lib/site';

// /sitemap.xml: the public pages, with one entry per fragrance from the real catalogue. Personal
// pages (bag, wishlist, checkout, account, orders) are left out and disallowed in robots.txt.
export default async function sitemap() {
  const products = await getProducts();
  return [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/shop`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: 'yearly', priority: 0.4 },
    ...products.map((p) => ({ url: `${SITE_URL}/product/${p.slug}`, changeFrequency: 'weekly', priority: 0.8 })),
  ];
}

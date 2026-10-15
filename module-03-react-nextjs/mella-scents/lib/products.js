import 'server-only';
import snapshot from './catalog-snapshot.json';
import { usdToEtb } from './money';

// The catalogue. It comes from the public DummyJSON API (the same source the Vite version
// fetched in the browser), but now it's fetched here, on the server:
//   - pages render with the products already in the HTML (no loading spinner, crawlable);
//   - the response is cached and refreshed at most once an hour (ISR);
//   - if the API is slow or down, a snapshot committed with the app is used instead, so the
//     shop still works. The snapshot also supplies local copies of the photos.
// CATALOG_API_URL exists only to test the fallback (point it at a dead address); leave it unset.
const API_URL = process.env.CATALOG_API_URL || 'https://dummyjson.com/products/category/fragrances?limit=0';
const REFRESH_SECONDS = 3600;
const TIMEOUT_MS = 5000;

const localPhotos = new Map(snapshot.products.map((p) => [p.id, p.remoteImages.map((_, i) => `/products/${p.id}/${i + 1}.webp`)]));

// One product, in the shape every page uses. Prices become ETB here, once.
function shape(raw) {
  const images = localPhotos.get(raw.id) ?? raw.images ?? raw.remoteImages ?? [];
  return {
    id: raw.id,
    slug: String(raw.id),
    title: raw.title,
    brand: raw.brand,
    description: raw.description,
    price: usdToEtb(raw.price ?? raw.priceUsd),
    rating: raw.rating,
    stock: raw.stock,
    tags: raw.tags ?? [],
    sku: raw.sku,
    shipping: raw.shippingInformation ?? raw.shipping,
    returnPolicy: raw.returnPolicy,
    images,
    image: images[0],
    reviews: (raw.reviews ?? []).map((r) => ({ rating: r.rating, comment: r.comment, date: r.date, name: r.reviewerName ?? r.name })),
  };
}

export async function getProducts() {
  try {
    const res = await fetch(API_URL, { next: { revalidate: REFRESH_SECONDS }, signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) throw new Error(`DummyJSON answered ${res.status}`);
    const json = await res.json();
    if (!Array.isArray(json.products) || json.products.length === 0) throw new Error('DummyJSON returned no products');
    return json.products.map(shape);
  } catch (error) {
    console.warn(`[products] using the committed snapshot: ${error.message}`);
    return snapshot.products.map(shape);
  }
}

export async function getProduct(id) {
  const products = await getProducts();
  return products.find((product) => product.slug === String(id)) ?? null;
}

export async function getFeatured(limit = 4) {
  const products = await getProducts();
  return [...products].sort((a, b) => b.rating - a.rating).slice(0, limit);
}

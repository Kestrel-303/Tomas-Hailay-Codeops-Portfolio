import { getProducts } from '@/lib/products';

// GET /api/products (?q=dior): the catalogue with ETB prices, for outside callers (a partner app,
// curl). The site's own pages call lib/products.js directly instead of fetching their own API.
export async function GET(request) {
  const q = (request.nextUrl.searchParams.get('q') ?? '').trim().toLowerCase();
  const products = await getProducts();
  const matches = q ? products.filter((p) => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)) : products;
  return Response.json(
    matches.map(({ reviews, ...product }) => product),
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
  );
}

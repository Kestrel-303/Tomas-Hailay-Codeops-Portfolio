import { searchDishes } from '@/lib/dishes';

// GET /api/dishes/search?q=wat → { q, items, total }
export async function GET(request) {
  const q = request.nextUrl.searchParams.get('q') ?? '';

  // Random latency (200–1000ms) so responses can come back out of order. The UI must still
  // only ever show results for the term currently typed (see DATA.md, "never the wrong results").
  await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 800));

  return Response.json(searchDishes(q));
}

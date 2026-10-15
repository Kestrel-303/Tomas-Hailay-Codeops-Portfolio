import { getMenuPage } from '@/lib/dishes';
import { parsePage } from '@/lib/query-keys';

// GET /api/menu?category=Tibs&page=2 → { category, items, page, totalPages, total }
export async function GET(request) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get('category') || 'All';
  const page = parsePage(searchParams.get('page'));

  // Artificial latency so the gap between pages is visible (that's what keepPreviousData covers).
  await new Promise((resolve) => setTimeout(resolve, 500));

  return Response.json(getMenuPage(category, page));
}

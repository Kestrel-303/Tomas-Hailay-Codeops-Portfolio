import { searchDishes } from "../../../../lib/dishes";

// GET /api/dishes/search?q=wot&page=2
export async function GET(request) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q") ?? "";
  const page = Number.parseInt(searchParams.get("page") ?? "1", 10) || 1;

  // Artificial latency so the gap between searches is visible in the UI and the network tab.
  await new Promise((resolve) => setTimeout(resolve, 600));

  return Response.json(searchDishes(q, page));
}

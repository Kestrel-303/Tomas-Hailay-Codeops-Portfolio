import { errorResponse } from '@/lib/api-errors';
import { getProduct } from '@/lib/products';

// GET /api/products/:id: one fragrance, or a 404 with a JSON body (never an empty 200).
export async function GET(_request, { params }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return errorResponse(404, 'Fragrance not found', { id });
  return Response.json(product);
}

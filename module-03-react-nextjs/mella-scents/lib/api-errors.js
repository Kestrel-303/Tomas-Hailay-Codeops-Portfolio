// Every error from a route handler has one shape: { "error": "<message>" }, plus `fieldErrors`
// on validation failures.
export function errorResponse(status, error, extra = {}) {
  return Response.json({ error, ...extra }, { status });
}

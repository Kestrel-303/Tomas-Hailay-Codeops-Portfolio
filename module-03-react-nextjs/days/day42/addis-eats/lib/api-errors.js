// Every error this app returns, from a route handler or a server action, has the same shape:
// { error: { code, message, fieldErrors? } }
export function errorBody(code, message, extra = {}) {
  return { error: { code, message, ...extra } };
}

export function errorResponse(status, code, message, extra) {
  return Response.json(errorBody(code, message, extra), { status });
}

// The one fetcher behind every SWR query (registered globally in app/Providers.jsx).
// fetch() only rejects on a network failure, never on a 404 or 500, and SWR only sees an
// error when the fetcher throws, so any non-OK response is turned into a thrown Error that
// carries the HTTP status and our API's { error: { code, message } } body.
export async function fetcher(url) {
  const res = await fetch(url);
  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error(body?.error?.message ?? `Request failed with status ${res.status}`);
    error.status = res.status;
    error.code = body?.error?.code;
    throw error;
  }

  return body;
}

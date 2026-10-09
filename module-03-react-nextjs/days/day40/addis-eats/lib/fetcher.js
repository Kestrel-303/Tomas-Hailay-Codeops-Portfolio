// The one fetcher every useSWR call in the app shares.
// SWR only treats a request as failed if the fetcher throws, and fetch() doesn't throw on 4xx/5xx,
// so non-2xx responses are turned into an Error carrying the status and our API's error body.
export async function fetcher(url) {
  const res = await fetch(url);
  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error(body?.error?.message ?? `Request failed with status ${res.status}`);
    error.status = res.status;
    error.info = body?.error;
    throw error;
  }

  return body;
}

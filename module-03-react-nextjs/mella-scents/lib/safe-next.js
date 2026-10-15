// Where to send someone after signing in. `next` comes from the URL, so it's untrusted: only a
// path on this site is allowed. "https://evil.example", "//evil.example" and "/\evil.example"
// would all leave the site, so they fall back to the account page.
export function safeNext(value, fallback = '/account') {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return fallback;
  return value;
}

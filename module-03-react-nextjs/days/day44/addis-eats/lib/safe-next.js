// The `next` parameter decides where we redirect after sign-in, and anyone can put anything in a
// link. Only same-site paths are allowed, otherwise /sign-in?next=https://evil.example becomes a
// phishing link that starts on our real domain.
//
// It must start with "/", but not "//" or "/\" — browsers read those as protocol-relative URLs
// (//evil.example) and leave the site. Control characters are rejected too, because browsers
// strip tabs and newlines from URLs, which turns "/\t/evil.example" back into "//evil.example".
export function safeNext(next, fallback = "/orders") {
  if (typeof next !== "string") return fallback;
  if (!next.startsWith("/")) return fallback;
  if (next.startsWith("//") || next.startsWith("/\\")) return fallback;
  if (/[\x00-\x1f\x7f]/.test(next)) return fallback;
  return next;
}

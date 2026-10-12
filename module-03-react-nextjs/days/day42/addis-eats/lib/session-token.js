// Signs and verifies the session cookie's value. No next/headers import, so middleware
// (edge runtime) and server code (node runtime) can both use it. Web Crypto works in both.
//
// A token is `<payload>.<signature>`, both base64url. The payload is readable by anyone who
// has the cookie, so it only holds the user id, display name, role and expiry. The signature
// is what stops someone from editing their own role to "staff".

export const SESSION_COOKIE = "session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

const DEV_SECRET = "addis-eats-dev-secret-change-me";
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set in production. See .env.example.");
  }
  return DEV_SECRET;
}

let keyPromise;
function getKey() {
  keyPromise ??= crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  return keyPromise;
}

function toBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(text) {
  const base64 = text.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export async function signSession({ id, name, role }) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload = toBase64Url(encoder.encode(JSON.stringify({ id, name, role, exp })));
  const signature = await crypto.subtle.sign("HMAC", await getKey(), encoder.encode(payload));
  return `${payload}.${toBase64Url(new Uint8Array(signature))}`;
}

// Returns the session, or null for anything missing, tampered with, malformed or expired.
export async function verifySession(token) {
  if (typeof token !== "string") return null;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra !== undefined) return null;

  try {
    // crypto.subtle.verify compares in constant time, so the signature can't be guessed byte by byte.
    const valid = await crypto.subtle.verify(
      "HMAC",
      await getKey(),
      fromBase64Url(signature),
      encoder.encode(payload)
    );
    if (!valid) return null;

    const session = JSON.parse(decoder.decode(fromBase64Url(payload)));
    if (typeof session.exp !== "number" || session.exp * 1000 < Date.now()) return null;
    return { id: session.id, name: session.name, role: session.role };
  } catch {
    return null;
  }
}

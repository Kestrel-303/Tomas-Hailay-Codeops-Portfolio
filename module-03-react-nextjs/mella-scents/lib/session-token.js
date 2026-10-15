import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

// The session cookie format: base64url(JSON payload) + "." + HMAC-SHA256 signature. Changing any
// character of the payload (to become someone else) breaks the signature. Used by proxy.js and
// lib/session.js; it only ever runs on the server.
export const SESSION_COOKIE = 'ms_session';
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours, then sign in again

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error(
      'SESSION_SECRET is missing or shorter than 32 characters. Locally: .env.local (see .env.example). On Vercel: Settings → Environment Variables, a separate value for Production and for Preview.',
    );
  }
  return value;
}

const sign = (data) => createHmac('sha256', secret()).update(data).digest('base64url');

export function createSessionToken(user) {
  const payload = { sid: randomUUID(), uid: user.id, name: user.name, email: user.email, exp: Date.now() + SESSION_MAX_AGE * 1000 };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return { token: `${data}.${sign(data)}`, payload };
}

// The payload if the token is genuine and unexpired, otherwise null.
export function verifySessionToken(token) {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const [data, signature] = token.split('.');
  const expected = Buffer.from(sign(data));
  const given = Buffer.from(signature ?? '');
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString());
    return payload.exp > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

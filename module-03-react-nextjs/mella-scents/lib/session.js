import 'server-only';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken, verifySessionToken } from './session-token';

// A signed cookie stays valid until it expires, even after sign-out, if someone kept a copy. So
// each session has an id (sid), and signing out records it here. Kept on globalThis like the order
// store: in memory, so a restart forgets it.
const revoked = globalThis.__mellaRevokedSessions ?? (globalThis.__mellaRevokedSessions = new Set());

export async function getSession() {
  const store = await cookies();
  const payload = verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!payload || revoked.has(payload.sid)) return null;
  return { id: payload.uid, name: payload.name, email: payload.email, sid: payload.sid };
}

export async function startSession(user) {
  const { token } = createSessionToken(user);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true, // JavaScript in the page can't read or steal it
    secure: process.env.NODE_ENV === 'production', // HTTPS only once deployed
    sameSite: 'lax', // not sent on cross-site POSTs
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export async function endSession() {
  const store = await cookies();
  const payload = verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (payload) revoked.add(payload.sid);
  store.delete(SESSION_COOKIE);
}

export function isRevoked(sid) {
  return revoked.has(sid);
}

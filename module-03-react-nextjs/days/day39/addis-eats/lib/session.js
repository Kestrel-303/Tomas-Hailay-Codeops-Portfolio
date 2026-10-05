import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifySession } from "./session-token";

// Reads the "session" cookie and verifies its signature and expiry.
// Returns { id, name, role } or null. Never trust the cookie without going through this.
export async function getSession() {
  const cookieStore = await cookies();
  return verifySession(cookieStore.get(SESSION_COOKIE)?.value);
}

// Only callable from a server action or route handler, where cookies can be set.
export async function createSession(user) {
  const token = await signSession(user);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true, // page JavaScript can't read it, so an XSS bug can't steal it
    secure: true, // HTTPS only (browsers treat http://localhost as secure, so dev still works)
    sameSite: "lax", // not sent on cross-site POSTs, but still sent when following a link in
    path: "/",
    maxAge: SESSION_MAX_AGE, // matches the expiry signed into the token
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

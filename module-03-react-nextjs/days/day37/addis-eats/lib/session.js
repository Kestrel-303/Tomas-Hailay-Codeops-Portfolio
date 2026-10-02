import { cookies } from "next/headers";

const SESSION_COOKIE = "session";

// There is no login yet: a visitor's session is just an id in the "session" cookie.
export async function getSession() {
  const cookieStore = await cookies();
  const id = cookieStore.get(SESSION_COOKIE)?.value;
  return id ? { id } : null;
}

// Only callable from a server action or route handler, where cookies can be set.
export async function getOrCreateSession() {
  const existing = await getSession();
  if (existing) return existing;

  const id = crypto.randomUUID();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, id, { httpOnly: true, sameSite: "lax", path: "/" });
  return { id };
}

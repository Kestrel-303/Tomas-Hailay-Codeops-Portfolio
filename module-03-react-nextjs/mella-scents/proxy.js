import { NextResponse } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from './lib/session-token';

// Layer 1 of 3: signed-out visitors are sent to sign-in before a private page even renders, with
// where they were going in `next`. It isn't the only check: every private page, server action and
// route handler calls getSession() again (and only that check knows about signed-out sessions).
export function proxy(request) {
  if (verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  const signIn = new URL('/login', request.url);
  signIn.searchParams.set('next', pathname + search);
  return NextResponse.redirect(signIn);
}

export const config = {
  // Only the private pages. The shop, the bag, sign-in, /api/* and static files never run this.
  matcher: ['/checkout/:path*', '/account/:path*', '/orders/:path*'],
};

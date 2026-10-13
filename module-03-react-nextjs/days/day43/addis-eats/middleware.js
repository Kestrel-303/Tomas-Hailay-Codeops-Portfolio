import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "./lib/session-token";

// Bounces signed-out visitors to /sign-in before /checkout or /orders even render, and carries
// where they were going in `next`. This is the first check, not the only one: the pages, server
// actions and API routes all call getSession() again, because middleware only runs on the
// paths in the matcher below.
export async function middleware(request) {
  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
  if (session) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  const signInUrl = new URL("/sign-in", request.url);
  signInUrl.searchParams.set("next", pathname + search);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  // Only these two sections. "/orders/:path*" covers /orders and /orders/AE-123; everything
  // else (menu, search, /api/*, static files) never runs this code.
  matcher: ["/checkout/:path*", "/orders/:path*"],
};

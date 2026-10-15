import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

// Who's signed in, for the header. Display only: every private page, action and route handler
// checks the session on the server itself.
export async function GET() {
  const session = await getSession();
  return Response.json({ user: session ? { name: session.name, email: session.email } : null }, { headers: { 'Cache-Control': 'private, no-store' } });
}

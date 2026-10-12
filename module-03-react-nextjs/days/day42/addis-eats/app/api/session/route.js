import { getSession } from "../../../lib/session";

export const dynamic = "force-dynamic";

// Lets the client-side NavBar know who is signed in without the root layout reading cookies,
// which would turn every static page (menu, dish pages) dynamic. Only for display: anything
// that matters checks getSession() on the server itself.
export async function GET() {
  const session = await getSession();
  return Response.json({ user: session });
}

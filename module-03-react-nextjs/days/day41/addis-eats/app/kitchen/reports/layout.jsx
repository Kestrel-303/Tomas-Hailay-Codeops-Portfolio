import { notFound, redirect } from "next/navigation";
import { getSession } from "../../../lib/session";

// The access check lives here, not only in page.jsx, because of loading.jsx. With a loading
// boundary Next streams the skeleton immediately with a 200, and a redirect() or notFound() in
// the page then happens inside that stream instead of as a real 307/404. A layout sits above the
// loading boundary, so it finishes before anything is sent: signed-out visitors get a real
// redirect and customers a real 404, and neither ever sees the "Loading reports" skeleton.
export default async function ReportsLayout({ children }) {
  const session = await getSession();
  if (!session) redirect("/sign-in?next=/kitchen/reports");
  if (session.role !== "staff") notFound();
  return children;
}

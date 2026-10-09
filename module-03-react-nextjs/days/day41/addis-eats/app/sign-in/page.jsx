import { redirect } from "next/navigation";
import { safeNext } from "../../lib/safe-next";
import { getSession } from "../../lib/session";
import SignInForm from "./SignInForm";

export default async function SignInPage({ searchParams }) {
  const { next } = await searchParams;
  const destination = safeNext(next);

  // Already signed in: skip the form and go where they were headed.
  if (await getSession()) redirect(destination);

  return (
    <div className="page" style={{ maxWidth: "440px" }}>
      <div className="page-header">
        <span className="eyebrow">Account</span>
        <h1 className="page-title">Sign in</h1>
        <p className="page-subtitle">Sign in to check out and see your orders.</p>
      </div>

      {/* Only the checked value reaches the form, so a crafted ?next= never makes it into the page. */}
      <SignInForm next={destination} />

      <div className="card" style={{ marginTop: "1.25rem" }}>
        <span className="eyebrow">Demo accounts</span>
        <ul style={{ margin: "0.5rem 0 0", paddingLeft: "1.1rem" }} className="dish-category">
          <li>abebe@example.com / injera123</li>
          <li>sara@example.com / injera123</li>
          <li>kitchen@addiseats.et / kitchen123 (staff)</li>
        </ul>
      </div>
    </div>
  );
}

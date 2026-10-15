"use client";

import { useActionState, useEffect, useRef } from "react";
import { signIn } from "./actions";

export default function SignInForm({ next }) {
  const [state, formAction, pending] = useActionState(signIn, { status: null });
  // After "wrong email or password" the disabled button has lost focus; put it back in the
  // email field, where the next attempt starts. The alert is still announced.
  const emailRef = useRef(null);
  useEffect(() => {
    if (state.error) emailRef.current?.focus();
  }, [state]);

  return (
    <form action={formAction} className="card order-form">
      <input type="hidden" name="next" value={next} />

      <div className="form-field">
        <label htmlFor="sign-in-email">Email</label>
        <input
          ref={emailRef}
          id="sign-in-email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state.values?.email ?? ""}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="sign-in-password">Password</label>
        <input id="sign-in-password" name="password" type="password" autoComplete="current-password" required />
      </div>

      {state.error && (
        <p role="alert" className="form-error">
          {state.error.message}
        </p>
      )}

      <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

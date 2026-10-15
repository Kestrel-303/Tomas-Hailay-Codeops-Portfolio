'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useSubmitOnce } from '@/lib/use-submit-once';
import { signIn } from './actions';

// A real form posting to a server action: with JavaScript off it still signs in.
export default function LoginForm({ next }) {
  const [state, formAction, pending] = useActionState(signIn, { error: '' });
  const submitOnce = useSubmitOnce(pending);
  const email = useRef(null);

  // After "wrong email or password", put focus back in the email field (the button was disabled).
  useEffect(() => {
    if (state.error) email.current?.focus();
  }, [state]);

  return (
    <form action={formAction} onSubmit={submitOnce} className="login-form">
      <input type="hidden" name="next" value={next} />
      <div className="field">
        <label htmlFor="login-email" className="field__label">
          Email
        </label>
        <input
          ref={email}
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.email ?? ''}
          aria-invalid={Boolean(state.error)}
          aria-describedby={state.error ? 'login-error' : undefined}
        />
      </div>
      <div className="field">
        <label htmlFor="login-password" className="field__label">
          Password
        </label>
        <input id="login-password" name="password" type="password" autoComplete="current-password" required aria-invalid={Boolean(state.error)} />
      </div>
      {state.error && (
        <p id="login-error" role="alert" className="field__error">
          {state.error}
        </p>
      )}
      <button type="submit" className="btn btn-solid" disabled={pending}>
        {pending ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  );
}

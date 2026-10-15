'use client';

import { useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';

// Submit button for a plain server-action form (one with no client component of its own). It
// disables itself while the action runs and ignores extra clicks before that re-render, so a double
// tap sends one request. The form still works with JavaScript off.
export default function SubmitButton({ children, pendingText, className }) {
  const { pending } = useFormStatus();
  const sent = useRef(false);

  useEffect(() => {
    if (!pending) sent.current = false;
  }, [pending]);

  return (
    <button
      type="submit"
      className={className}
      disabled={pending}
      onClick={(event) => {
        if (sent.current) {
          event.preventDefault();
          return;
        }
        sent.current = true;
      }}
    >
      {pending ? pendingText : children}
    </button>
  );
}

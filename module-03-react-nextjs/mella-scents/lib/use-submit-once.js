'use client';

import { useEffect, useRef } from 'react';

// The onSubmit for a form with a server action. disabled={pending} alone lets a double tap through:
// `pending` only becomes true after React re-renders, and two submits can land before that. This
// lets the first submit through and cancels the rest until it has finished.
export function useSubmitOnce(pending) {
  const busy = useRef(false);

  useEffect(() => {
    if (!pending) busy.current = false;
  }, [pending]);

  return function onSubmit(event) {
    if (event.defaultPrevented) return; // an earlier handler (validation) already stopped it
    if (busy.current) {
      event.preventDefault();
      return;
    }
    busy.current = true;
  };
}

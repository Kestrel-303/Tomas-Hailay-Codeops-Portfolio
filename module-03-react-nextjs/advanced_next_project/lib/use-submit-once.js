'use client';

import { useEffect, useRef } from 'react';

// The forms' onSubmit handler. disabled={pending} alone doesn't stop a double tap: `pending`
// becomes true only after React re-renders, and two taps (or a double Enter) can both arrive
// before that, each starting its own action. Measured on mini-project 19: two clicks in the same
// instant placed two orders.
//
// This lets the first submit through and cancels the rest until it has finished (pending went
// true, then false). A cancelled submit event never reaches the form's action.
export function useSubmitOnce(pending) {
  const inFlight = useRef(false);

  useEffect(() => {
    if (!pending) inFlight.current = false;
  }, [pending]);

  return function onSubmit(event) {
    if (inFlight.current) {
      event.preventDefault();
      return;
    }
    inFlight.current = true;
  };
}

"use client";

import { useEffect, useRef } from "react";

// disabled={pending} alone isn't enough to stop a double tap. `pending` only becomes true after
// React re-renders, and two taps (or two Enters) can land before that. The second submit event
// then starts a second action: in the day 44 test, two clicks in the same instant placed two
// orders.
//
// This returns an onSubmit handler that lets one submission through and cancels any other until
// that one has finished (pending went true, then back to false). Cancelling the submit event also
// stops a React form action from running.
export function useSubmitOnce(pending) {
  const busy = useRef(false);

  useEffect(() => {
    if (!pending) busy.current = false;
  }, [pending]);

  return function onSubmit(event) {
    if (busy.current) {
      event.preventDefault();
      return;
    }
    busy.current = true;
  };
}

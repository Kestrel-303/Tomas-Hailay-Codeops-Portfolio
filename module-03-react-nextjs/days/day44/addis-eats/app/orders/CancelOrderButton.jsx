"use client";

import { useActionState } from "react";
import { useSubmitOnce } from "../../lib/use-submit-once";
import { cancelOrder } from "./actions";

export default function CancelOrderButton({ orderId }) {
  const [state, formAction, pending] = useActionState(cancelOrder, { status: null });
  // A double tap would otherwise send a second cancel, which comes back "already cancelled".
  const submitOnce = useSubmitOnce(pending);

  return (
    <form action={formAction} onSubmit={submitOnce}>
      <input type="hidden" name="orderId" value={orderId} />
      <button type="submit" className="btn btn-ghost" disabled={pending}>
        {pending ? "Cancelling..." : "Cancel order"}
      </button>
      {state.error && (
        <small role="alert" className="form-error">
          {state.error.message}
        </small>
      )}
    </form>
  );
}

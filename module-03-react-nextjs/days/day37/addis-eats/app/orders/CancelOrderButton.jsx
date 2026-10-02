"use client";

import { useActionState } from "react";
import { cancelOrder } from "./actions";

export default function CancelOrderButton({ orderId }) {
  const [state, formAction, pending] = useActionState(cancelOrder, { status: null });

  return (
    <form action={formAction}>
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

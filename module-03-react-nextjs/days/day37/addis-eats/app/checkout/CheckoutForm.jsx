"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useCart } from "../../lib/cart-context";
import { areaOptions } from "../../lib/order-schema";
import { placeOrder } from "../orders/actions";

const initialState = { status: null };

export default function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart();
  const [state, formAction, pending] = useActionState(placeOrder, initialState);

  useEffect(() => {
    if (state.status === 201) clearCart();
    // clearCart is recreated every render; we only want this to run once per new result.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // Branch on the status code exactly like the Day 33 fetch did.
  let fieldErrors = {};
  let formError = "";
  switch (state.status) {
    case 201:
      return (
        <div className="card">
          <span className="eyebrow">Order placed</span>
          <h2 style={{ fontSize: "1.25rem", margin: "0.25rem 0 0.5rem" }}>Thanks, {state.order.customer.name}!</h2>
          <p className="page-subtitle">
            Order <strong>{state.order.id}</strong> — ${state.order.total.toFixed(2)}, delivering to{" "}
            {state.order.customer.area}.
          </p>
          <div className="actions-row">
            <Link href="/orders" className="btn btn-primary">
              View my orders
            </Link>
            <Link href="/menu" className="btn btn-ghost">
              Back to menu
            </Link>
          </div>
        </div>
      );
    case 422:
      fieldErrors = state.error.fieldErrors;
      formError = state.error.message;
      break;
    case null:
      break;
    default:
      formError = state.error?.message ?? "Something went wrong. Please try again.";
  }

  if (items.length === 0) {
    return (
      <div className="card">
        <p className="page-subtitle">Your cart is empty.</p>
        <Link href="/menu" className="btn btn-primary" style={{ marginTop: "1rem" }}>
          Browse the menu
        </Link>
      </div>
    );
  }

  const values = state.values ?? { name: "", phone: "", area: "Bole", notes: "" };

  return (
    <div className="card">
      <ul style={{ margin: "0 0 1rem", paddingLeft: "1.1rem" }}>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} × {item.quantity} — ${(item.price * item.quantity).toFixed(2)}
          </li>
        ))}
      </ul>
      <p style={{ fontWeight: 700, marginBottom: "1.25rem" }}>Total: ${subtotal.toFixed(2)}</p>

      {/* key remounts the fields so a 422 response refills them with what was submitted */}
      <form action={formAction} noValidate key={JSON.stringify(state)} className="order-form">
        <input type="hidden" name="items" value={JSON.stringify(items.map(({ id, quantity }) => ({ id, quantity })))} />

        <Field label="Full name" name="name" error={fieldErrors.name}>
          <input id="checkout-name" name="name" type="text" defaultValue={values.name} placeholder="Your name" />
        </Field>

        <Field label="TeleBirr phone" name="phone" error={fieldErrors.phone}>
          <input id="checkout-phone" name="phone" type="tel" defaultValue={values.phone} placeholder="10-digit phone number" />
        </Field>

        <Field label="Delivery area" name="area" error={fieldErrors.area}>
          <select id="checkout-area" name="area" defaultValue={values.area}>
            {areaOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Notes" name="notes">
          <textarea id="checkout-notes" name="notes" defaultValue={values.notes} placeholder="Optional delivery notes" rows="3" />
        </Field>

        {fieldErrors.items && <p className="form-error">{fieldErrors.items}</p>}
        {formError && (
          <p role="alert" className="form-error">
            {formError}
          </p>
        )}

        <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
          {pending ? "Placing order..." : `Place order — $${subtotal.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
}

function Field({ label, name, error, children }) {
  return (
    <div className="form-field">
      <label htmlFor={`checkout-${name}`}>{label}</label>
      {children}
      {error && (
        <small id={`checkout-${name}-error`} role="alert" className="form-error">
          {error}
        </small>
      )}
    </div>
  );
}

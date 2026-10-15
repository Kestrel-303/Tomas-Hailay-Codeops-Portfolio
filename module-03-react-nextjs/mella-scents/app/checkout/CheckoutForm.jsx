'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { etb } from '@/lib/money';
import { DELIVERY_AREAS, validateCustomer } from '@/lib/order-schema';
import { useSubmitOnce } from '@/lib/use-submit-once';
import { placeOrder } from './actions';

const FIELDS = ['name', 'phone', 'area', 'notes'];

// Client for instant validation, the pending state and focus handling; still a real
// <form action={…}>, so with JavaScript off the browser posts it and the server action runs anyway.
export default function CheckoutForm({ total, defaultName }) {
  const [state, formAction, pending] = useActionState(placeOrder, { fieldErrors: {}, error: '', values: null });
  const [clientErrors, setClientErrors] = useState(null);
  const submitOnce = useSubmitOnce(pending);
  const form = useRef(null);
  // One id per visit to checkout, made after hydration. The server places one order per id, so a
  // repeated submission returns the same order instead of charging twice.
  const [requestId, setRequestId] = useState('');
  useEffect(() => setRequestId(crypto.randomUUID()), []);

  const errors = clientErrors ?? state.fieldErrors ?? {};
  const values = state.values ?? { name: defaultName ?? '', phone: '', area: 'Bole', notes: '' };

  // After a failed attempt, move focus to the first field to fix (or the error message).
  useEffect(() => {
    const first = FIELDS.find((name) => errors[name]);
    if (first) form.current?.elements.namedItem(first)?.focus();
    else if (state.error) form.current?.querySelector('[role="alert"]')?.focus();
  }, [state, clientErrors]); // eslint-disable-line react-hooks/exhaustive-deps

  function onSubmit(event) {
    // The same rules the server runs, first, to save a round trip.
    const { fieldErrors } = validateCustomer(Object.fromEntries(new FormData(event.currentTarget)));
    if (Object.keys(fieldErrors).length) {
      event.preventDefault();
      setClientErrors(fieldErrors);
      return;
    }
    setClientErrors(null);
    submitOnce(event);
  }

  const describedBy = (name, hint) => [hint, errors[name] && `${name}-error`].filter(Boolean).join(' ') || undefined;

  return (
    <form key={JSON.stringify(state.values)} ref={form} action={formAction} onSubmit={onSubmit} noValidate className="checkout-form">
      <input type="hidden" name="requestId" value={requestId} />

      <div className="field">
        <label htmlFor="name" className="field__label">
          Full Name
        </label>
        <input id="name" name="name" type="text" autoComplete="name" defaultValue={values.name} aria-invalid={Boolean(errors.name)} aria-describedby={describedBy('name')} />
        {errors.name && (
          <p id="name-error" className="field__error">
            {errors.name}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="phone" className="field__label">
          TeleBirr Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="09XXXXXXXX"
          defaultValue={values.phone}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={describedBy('phone', 'phone-hint')}
        />
        <p id="phone-hint" className="field__hint">
          Ethio telecom or Safaricom mobile: 09…, 07… or +251…
        </p>
        {errors.phone && (
          <p id="phone-error" className="field__error">
            {errors.phone}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="area" className="field__label">
          Addis Ababa Sub-City
        </label>
        <select id="area" name="area" defaultValue={values.area} aria-invalid={Boolean(errors.area)} aria-describedby={describedBy('area')}>
          {DELIVERY_AREAS.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
        {errors.area && (
          <p id="area-error" className="field__error">
            {errors.area}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="notes" className="field__label">
          Delivery Notes (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          maxLength={300}
          placeholder="Gate code, nearby landmark…"
          defaultValue={values.notes}
          aria-invalid={Boolean(errors.notes)}
          aria-describedby={describedBy('notes')}
        />
        {errors.notes && (
          <p id="notes-error" className="field__error">
            {errors.notes}
          </p>
        )}
      </div>

      {state.error && (
        <p role="alert" tabIndex={-1} className="checkout-form__server-error">
          {state.error}
        </p>
      )}

      <button type="submit" className="btn btn-solid" disabled={pending}>
        {pending ? 'Processing payment…' : `Pay ${etb(total)} with TeleBirr`}
      </button>
    </form>
  );
}

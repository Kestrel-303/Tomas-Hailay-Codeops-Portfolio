'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { CART_COOKIE, parseCart } from '@/lib/cart-cookie';
import { validateCustomer, validateLines } from '@/lib/order-schema';
import { createOrder } from '@/lib/orders';
import { getProducts } from '@/lib/products';
import { getSession } from '@/lib/session';

// The TeleBirr number that always fails, so the payment-error path can be shown on demand (the
// Vite version failed at random 1 time in 10). Every other valid number succeeds.
const SIMULATED_DECLINE = '0900000000';

// A server action is a public POST endpoint, so everything is checked again here: the session,
// every field, and the bag (read from the cookie, priced from the catalogue, never from the form).
export async function placeOrder(_previous, formData) {
  const session = await getSession();
  if (!session) redirect('/login?next=/checkout');

  const { values, fieldErrors } = validateCustomer(Object.fromEntries(formData));
  if (Object.keys(fieldErrors).length) return { fieldErrors, error: '', values };

  const store = await cookies();
  const { items, error } = validateLines(parseCart(store.get(CART_COOKIE)?.value), await getProducts());
  if (error) return { fieldErrors: {}, error, values };

  if (values.phone === SIMULATED_DECLINE) {
    return { fieldErrors: {}, error: 'TeleBirr declined the payment. Check the number and try again.', values };
  }

  const order = createOrder({ userId: session.id, customer: values, items, requestId: formData.get('requestId') || null });
  store.delete(CART_COOKIE);
  redirect(`/orders/${order.id}?placed=1`);
}

// npm test: the rules everything else depends on, without a server or a browser.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseCart, serializeCart } from './cart-cookie.js';
import { etb, usdToEtb } from './money.js';
import { DELIVERY_AREAS, validateCustomer, validateLines } from './order-schema.js';
import { safeNext } from './safe-next.js';

test('prices: dollars become birr once, rounded to 10, shown as ETB', () => {
  assert.equal(usdToEtb(89.99), 13500);
  assert.equal(usdToEtb(49.99), 7500);
  assert.equal(etb(13500), 'ETB 13,500');
});

test('bag cookie: round-trips, and drops anything malformed or excessive', () => {
  const lines = [{ id: '6', qty: 2 }, { id: '8', qty: 1 }];
  assert.deepEqual(parseCart(serializeCart(lines)), lines);
  assert.deepEqual(parseCart('6:2,6:5,abc,9:0,10:99,<script>:1'), [{ id: '6', qty: 2 }, { id: '10', qty: 10 }]);
  assert.deepEqual(parseCart(undefined), []);
});

test('checkout fields: the rules from the Vite version, enforced', () => {
  assert.deepEqual(validateCustomer({ name: 'Selam', phone: '0911 234-567', area: 'Bole' }).fieldErrors, {});
  assert.deepEqual(validateCustomer({ name: 'Selam', phone: '+251711234567', area: 'Ayat' }).fieldErrors, {});
  const bad = validateCustomer({ name: ' ', phone: '0811234567', area: 'Paris', notes: 'x'.repeat(301) }).fieldErrors;
  assert.deepEqual(Object.keys(bad).sort(), ['area', 'name', 'notes', 'phone']);
  assert.equal(DELIVERY_AREAS.length, 10);
});

test('bag lines: priced from the catalogue, never from the request', () => {
  const catalogue = [{ slug: '8', title: "Dior J'adore", brand: 'Dior', image: '/x.webp', price: 13500, stock: 5 }];
  const ok = validateLines([{ id: '8', qty: 2, price: 1 }], catalogue);
  assert.equal(ok.items[0].price, 13500);
  assert.match(validateLines([{ id: '99', qty: 1 }], catalogue).error, /not in the collection/);
  assert.match(validateLines([{ id: '8', qty: 6 }], catalogue).error, /Only 5/);
  assert.match(validateLines([], catalogue).error, /empty/);
});

test('sign-in redirects stay on this site', () => {
  assert.equal(safeNext('/checkout'), '/checkout');
  for (const evil of ['https://evil.example', '//evil.example', '/\\evil.example', undefined]) assert.equal(safeNext(evil), '/account');
});

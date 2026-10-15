// Run with: npm test
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { etb, relative, when } from './format.js';

// Intl puts a non-breaking space between "ETB" and the number, so they never wrap apart.
const NBSP = ' ';

test('etb: full, compact and unit-less', () => {
  assert.equal(etb(450), `ETB${NBSP}450`);
  assert.equal(etb(1235), `ETB${NBSP}1,235`);
  assert.equal(etb(12300, { compact: true }), `ETB${NBSP}12.3K`);
  assert.equal(etb(1235, { unit: false }), '1,235');
  assert.equal(etb(undefined), `ETB${NBSP}0`);
});

test('when: always Addis Ababa time', () => {
  assert.equal(when('2026-10-13T11:05:00Z'), '13 Oct, 14:05');
  assert.equal(when('2026-10-13T11:05:00Z', 'time'), '14:05');
  // 22:30 UTC on the 13th is 01:30 on the 14th in Addis Ababa.
  assert.equal(when('2026-10-13T22:30:00Z', 'day-key'), '2026-10-14');
  assert.equal(when('2026-10-13T22:30:00Z', 'sheet'), '2026-10-14 01:30');
  assert.equal(when('2026-10-13T11:05:00Z', 'day-year'), '13 Oct 2026');
});

test('relative: both directions from a given now', () => {
  const now = '2026-10-13T12:00:00Z';
  assert.equal(relative('2026-10-13T11:59:50Z', now), 'just now');
  assert.equal(relative('2026-10-13T12:00:20Z', now), 'in under a minute');
  assert.equal(relative('2026-10-13T11:57:00Z', now), '3 minutes ago');
  assert.equal(relative('2026-10-13T12:05:00Z', now), 'in 5 minutes');
  assert.equal(relative('2026-10-13T09:00:00Z', now), '3 hours ago');
  assert.equal(relative('2026-10-12T12:00:00Z', now), 'yesterday');
});

// Run with: npm test
import assert from "node:assert/strict";
import { test } from "node:test";
import { etb, relative, when } from "./format.js";

test("etb prints whole birr, full or compact", () => {
  // Intl puts a non-breaking space after the currency code, so "ETB" never wraps away from the number.
  assert.equal(etb(1235), "ETB 1,235");
  assert.equal(etb(12300, { compact: true }), "ETB 12.3K");
});

test("when is always Addis Ababa time", () => {
  // 11:05 UTC is 14:05 in Addis Ababa (UTC+3).
  assert.equal(when("2026-10-13T11:05:00Z"), "13 Oct, 14:05");
  assert.equal(when("2026-10-13T11:05:00Z", "time"), "14:05");
  assert.equal(when("2026-10-13T22:30:00Z", "sortable"), "2026-10-14 01:30");
});

test("relative reads both ways from a given now", () => {
  const now = "2026-10-13T12:00:00Z";
  assert.equal(relative("2026-10-13T11:59:50Z", now), "just now");
  assert.equal(relative("2026-10-13T11:57:00Z", now), "3 minutes ago");
  assert.equal(relative("2026-10-13T12:00:20Z", now), "in under a minute");
  assert.equal(relative("2026-10-13T12:05:00Z", now), "in 5 minutes");
  assert.equal(relative("2026-10-13T09:00:00Z", now), "3 hours ago");
  assert.equal(relative("2026-10-12T12:00:00Z", now), "yesterday");
});

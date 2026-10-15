// npm test: a session cookie can't be edited, forged or reused after it expires.
import assert from 'node:assert/strict';
import { test } from 'node:test';

process.env.SESSION_SECRET = 'test-secret-that-is-at-least-32-characters-long';
const { createSessionToken, verifySessionToken } = await import('./session-token.js');

test('a genuine token verifies', () => {
  const { token } = createSessionToken({ id: 'u-selam', name: 'Selam', email: 'selam@mellascents.et' });
  assert.equal(verifySessionToken(token).uid, 'u-selam');
});

test('an edited payload fails the signature check', () => {
  const { token } = createSessionToken({ id: 'u-selam', name: 'Selam', email: 'selam@mellascents.et' });
  const [data, signature] = token.split('.');
  const forged = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(data, 'base64url')), uid: 'u-dawit' })).toString('base64url');
  assert.equal(verifySessionToken(`${forged}.${signature}`), null);
  assert.equal(verifySessionToken('garbage'), null);
  assert.equal(verifySessionToken(undefined), null);
});

test('a missing secret is a loud error, not a silent default', () => {
  const saved = process.env.SESSION_SECRET;
  delete process.env.SESSION_SECRET;
  assert.throws(() => createSessionToken({ id: 'x' }), /SESSION_SECRET is missing/);
  process.env.SESSION_SECRET = saved;
});

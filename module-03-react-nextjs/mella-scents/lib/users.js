import 'server-only';
import { scryptSync, timingSafeEqual } from 'node:crypto';

// Demo accounts. A real shop keeps these in a database; even here the passwords exist only as
// scrypt hashes. (The Vite version "signed in" any email with no password at all.)
const SALT = 'mella-scents-demo-salt';
const hash = (password) => scryptSync(password, SALT, 32);

const users = [
  { id: 'u-selam', email: 'selam@mellascents.et', name: 'Selam', passwordHash: hash('mella123') },
  { id: 'u-dawit', email: 'dawit@mellascents.et', name: 'Dawit', passwordHash: hash('mella123') },
];

// The same null for an unknown email and a wrong password, so the form can't be used to find
// out which emails have accounts.
export function verifyCredentials(email, password) {
  const user = users.find((u) => u.email === String(email ?? '').trim().toLowerCase());
  const attempt = hash(String(password ?? ''));
  if (!user || !timingSafeEqual(user.passwordHash, attempt)) return null;
  return { id: user.id, email: user.email, name: user.name };
}

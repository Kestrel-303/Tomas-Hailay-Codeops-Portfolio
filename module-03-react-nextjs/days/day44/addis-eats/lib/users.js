import { scryptSync, timingSafeEqual } from "node:crypto";

// Demo accounts. A real app keeps these in a database; the passwords are only ever stored hashed.
const SALT = "addis-eats-demo";
const hash = (password) => scryptSync(password, SALT, 32);

const users = [
  { id: "u-abebe", email: "abebe@example.com", name: "Abebe", role: "customer", passwordHash: hash("injera123") },
  { id: "u-sara", email: "sara@example.com", name: "Sara", role: "customer", passwordHash: hash("injera123") },
  { id: "u-kitchen", email: "kitchen@addiseats.et", name: "Kitchen", role: "staff", passwordHash: hash("kitchen123") },
];

// Same null for an unknown email and a wrong password, so the form can't be used to find accounts.
export function verifyCredentials(email, password) {
  const user = users.find((u) => u.email === String(email).trim().toLowerCase());
  const attempt = hash(String(password));
  if (!user || !timingSafeEqual(user.passwordHash, attempt)) return null;
  return { id: user.id, name: user.name, role: user.role };
}

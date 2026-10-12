# Sign-in and sessions in Addis Eats (Day 39)

Demo accounts: `abebe@example.com` / `injera123`, `sara@example.com` / `injera123`, `kitchen@addiseats.et` / `kitchen123` (staff).

## Pieces

| File | Job |
| --- | --- |
| `lib/session-token.js` | Signs / verifies the cookie value with HMAC-SHA256 (Web Crypto, so it runs in middleware too). |
| `lib/session.js` | `getSession()` reads + verifies the cookie; `createSession()` sets it; `destroySession()` clears it. |
| `lib/users.js` | Demo users with scrypt password hashes. |
| `lib/safe-next.js` | Validates the `next` redirect target. Tested in `lib/safe-next.test.mjs` (`npm test`). |
| `middleware.js` | Redirects signed-out visitors on `/checkout` and `/orders` to `/sign-in?next=…`. |
| `app/sign-in` | Sign-in page, form and `signIn` / `signOut` server actions. |
| `app/kitchen` | Staff-only list of every open order. |

## The cookie

`httpOnly`, `secure`, `sameSite: "lax"`, `path: "/"`, `maxAge` 7 days. The value is `payload.signature`; the payload (`id`, `name`, `role`, `exp`) is readable but can't be edited without breaking the signature. Set `SESSION_SECRET` (see `.env.example`) for `next build` / `next start`.

## Where each check lives

Middleware is only the first gate, and only for the matched paths. Everything that reads or writes data checks `getSession()` again:

- `/checkout`, `/orders`, `/orders/[id]` pages: redirect / 404 if no session or not the owner.
- `placeOrder`, `cancelOrder` server actions and `POST /api/orders`, `GET /api/orders/[id]`: 401 without a session. Another account's order gets 404, the same as a missing one.
- `/kitchen`: not in the matcher at all. The page checks `role === "staff"` on the server and 404s for customers. The NavBar only *shows* the link to staff, which is cosmetic.
- Orders are always looked up by `session.id` from the verified cookie, never by an id from the URL or form.

## Things to try (all checked against `next start`)

- Signed out, open `/orders/AE-1?x=1` → `/sign-in?next=%2Forders%2FAE-1%3Fx%3D1`, then sign in → back to that URL.
- `/sign-in?next=//evil.example` or `?next=https://evil.example` → the hidden field holds `/orders`; you land on `/orders`.
- Sign in as Sara and open one of Abebe's order URLs → 404 (page and API).
- Edit the cookie's payload to `"role":"staff"` → signature fails, treated as signed out.
- Sign in as Abebe and open `/kitchen` → 404.

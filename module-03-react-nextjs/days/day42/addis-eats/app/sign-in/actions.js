"use server";

import { redirect } from "next/navigation";
import { errorBody } from "../../lib/api-errors";
import { safeNext } from "../../lib/safe-next";
import { createSession, destroySession } from "../../lib/session";
import { verifyCredentials } from "../../lib/users";

export async function signIn(_prevState, formData) {
  const email = formData.get("email") ?? "";
  const next = formData.get("next") ?? "";

  const user = verifyCredentials(email, formData.get("password") ?? "");
  if (!user) {
    return { status: 401, ...errorBody("INVALID_CREDENTIALS", "Wrong email or password."), values: { email } };
  }

  await createSession(user);
  // `next` came from the URL, so it's checked again here; the form value can be edited too.
  redirect(safeNext(next));
}

export async function signOut() {
  await destroySession();
}

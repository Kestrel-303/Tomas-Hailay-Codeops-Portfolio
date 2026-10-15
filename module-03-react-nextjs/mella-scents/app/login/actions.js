'use server';

import { redirect } from 'next/navigation';
import { safeNext } from '@/lib/safe-next';
import { endSession, startSession } from '@/lib/session';
import { verifyCredentials } from '@/lib/users';

export async function signIn(_previous, formData) {
  const email = String(formData.get('email') ?? '');
  const user = verifyCredentials(email, formData.get('password'));
  // One message for an unknown email and a wrong password: the form can't confirm who has an account.
  if (!user) return { error: 'That email and password don’t match an account.', email };
  await startSession(user);
  redirect(safeNext(formData.get('next')));
}

export async function signOut() {
  await endSession();
  redirect('/');
}

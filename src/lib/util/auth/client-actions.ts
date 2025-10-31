'use client';

import { authClient } from '@/lib/auth/client';

export async function signInWithGoogle() {
  try {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/', // redirect sa home after successful login
    });
  } catch (error) {
    console.error('Sign in failed:', error);
    throw error;
  }
}

export async function signOutUser() {
  try {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = '/login'; // redirect to login after logout
        },
      },
    });
  } catch (error) {
    console.error('Sign out failed:', error);
    throw error;
  }
}

export { useSession } from '@/lib/auth/client';

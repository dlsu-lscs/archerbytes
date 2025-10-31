import { auth } from '@/config/auth';
import { headers } from 'next/headers';

export async function getSession() {
  const headersList = await headers();

  return await auth.api.getSession({
    headers: headersList,
  });
}

export async function requireAuth() {
  const session = await getSession();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  return session;
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

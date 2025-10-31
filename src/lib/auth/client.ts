'use client';

import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  // im not really sure if APP dapat or BASE
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
});

export const { signIn, signOut, useSession } = authClient;

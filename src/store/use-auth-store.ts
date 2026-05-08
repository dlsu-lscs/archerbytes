'use client';

import { create } from 'zustand';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  [key: string]: unknown;
}

interface AuthState {
  user: User | null;
  isLoginOpen: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  setLoginOpen: () => void;
  setLoginClose: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoginOpen: false,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  setLoginOpen: () => set({ isLoginOpen: true }),
  setLoginClose: () => set({ isLoginOpen: false }),
}));

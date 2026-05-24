'use client';

import { create } from 'zustand';

interface AuthState {
  isLoginOpen: boolean;
  setLoginOpen: () => void;
  setLoginClose: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoginOpen: false,
  setLoginOpen: () => set({ isLoginOpen: true }),
  setLoginClose: () => set({ isLoginOpen: false }),
}));

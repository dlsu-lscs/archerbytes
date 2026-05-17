'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/use-auth-store';

export function useReactionPopoverOpen() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const setLoginOpen = useAuthStore((state) => state.setLoginOpen);

  const onOpenChange = (nextOpen: boolean) => {
    if (nextOpen && !user) {
      setLoginOpen();
      return;
    }

    setIsOpen(nextOpen);
  };

  return {
    isOpen,
    onOpenChange,
  };
}

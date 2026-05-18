'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import { useSession } from '@/lib/auth/client';

export function useDraftCommentOpen() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;
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

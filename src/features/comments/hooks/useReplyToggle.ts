'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/use-auth-store';

export function useReplyToggle() {
  const [isReplying, setIsReplying] = useState(false);
  const user = useAuthStore((state) => state.user);
  const setLoginOpen = useAuthStore((state) => state.setLoginOpen);

  const toggleReply = () => {
    if (!user) {
      setLoginOpen();
      return;
    }

    setIsReplying((prev) => !prev);
  };

  return {
    isReplying,
    setIsReplying,
    toggleReply,
  };
}

'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import { useSession } from '@/lib/auth/client';

export function useReplyToggle() {
  const [isReplying, setIsReplying] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;
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

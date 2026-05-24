'use client';

import { useSession } from '@/lib/auth/client';
import { useUpdateComment } from './useUpdateComment';

interface UseCommentUpdateActionParams {
  commentId?: number;
  articleId: number;
  replyTo?: number | null;
  originalContent: string;
  onSuccess?: () => void;
}

export function useCommentUpdateAction({
  commentId,
  articleId,
  replyTo,
  originalContent,
  onSuccess,
}: UseCommentUpdateActionParams) {
  const { data: session } = useSession();
  const user = session?.user;
  const updateComment = useUpdateComment();

  const saveCommentEdit = (nextContent: string) => {
    if (!commentId || !user) return;

    const trimmedContent = nextContent.trim();
    if (!trimmedContent || trimmedContent === originalContent) {
      onSuccess?.();
      return;
    }

    updateComment.mutate(
      {
        commentId,
        userId: user.id,
        articleId,
        replyTo: replyTo ?? null,
        data: { content: trimmedContent },
      },
      {
        onSuccess,
      },
    );
  };

  return {
    saveCommentEdit,
    isPending: updateComment.isPending,
  };
}

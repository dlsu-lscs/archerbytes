'use client';

import { useSession } from '@/lib/auth/client';
import { useDeleteComment } from './useDeleteComment';

interface UseCommentDeleteActionParams {
  commentId?: number;
  articleId: number;
  replyTo?: number | null;
  onSuccess?: () => void;
}

export function useCommentDeleteAction({
  commentId,
  articleId,
  replyTo,
  onSuccess,
}: UseCommentDeleteActionParams) {
  const { data: session } = useSession();
  const user = session?.user;
  const deleteComment = useDeleteComment();

  const deleteCommentAction = () => {
    if (!commentId || !user) return;

    deleteComment.mutate(
      {
        commentId,
        userId: user.id,
        articleId,
        replyTo: replyTo ?? null,
      },
      {
        onSuccess,
      },
    );
  };

  return {
    deleteComment: deleteCommentAction,
    isPending: deleteComment.isPending,
  };
}

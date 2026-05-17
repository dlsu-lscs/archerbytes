'use client';

import { useAuthStore } from '@/store/use-auth-store';
import { useCreateCommentReaction } from './useCreateCommentReaction';
import { useDeleteCommentReaction } from './useDeleteCommentReaction';
import { useUpdateCommentReaction } from './useUpdateCommentReaction';
import type { ReactionType } from '../types';

interface UseCommentReactionSelectionParams {
  commentId?: number;
  articleId: number;
  replyTo?: number | null;
  currentReaction: ReactionType | null;
  onSuccess?: () => void;
}

export function useCommentReactionSelection({
  commentId,
  articleId,
  replyTo,
  currentReaction,
  onSuccess,
}: UseCommentReactionSelectionParams) {
  const user = useAuthStore((state) => state.user);
  const setLoginOpen = useAuthStore((state) => state.setLoginOpen);

  const createCommentReaction = useCreateCommentReaction();
  const updateCommentReaction = useUpdateCommentReaction();
  const deleteCommentReaction = useDeleteCommentReaction();

  const selectReaction = (reactionType: ReactionType) => {
    if (!commentId) return;

    if (!user) {
      setLoginOpen();
      return;
    }

    const mutationVariables = {
      userId: user.id,
      commentId,
      articleId,
      replyTo: replyTo ?? null,
    };

    const mutationOptions = {
      onSuccess,
    };

    if (currentReaction === reactionType) {
      deleteCommentReaction.mutate(mutationVariables, mutationOptions);
      return;
    }

    if (currentReaction) {
      updateCommentReaction.mutate(
        { ...mutationVariables, reactionType },
        mutationOptions,
      );
      return;
    }

    createCommentReaction.mutate(
      { ...mutationVariables, reactionType },
      mutationOptions,
    );
  };

  return {
    selectReaction,
    isPending:
      createCommentReaction.isPending ||
      updateCommentReaction.isPending ||
      deleteCommentReaction.isPending,
  };
}

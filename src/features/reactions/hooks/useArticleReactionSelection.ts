'use client';

import { useAuthStore } from '@/store/use-auth-store';
import { useSession } from '@/lib/auth/client';
import { useCreateArticleReaction } from './useCreateArticleReaction';
import { useDeleteArticleReaction } from './useDeleteArticleReaction';
import { useUpdateArticleReaction } from './useUpdateArticleReaction';
import type { ReactionType } from '../types';

interface UseArticleReactionSelectionParams {
  articleId: number;
  currentReaction: ReactionType | null;
  onSuccess?: () => void;
}

export function useArticleReactionSelection({
  articleId,
  currentReaction,
  onSuccess,
}: UseArticleReactionSelectionParams) {
  const { data: session } = useSession();
  const user = session?.user;
  const setLoginOpen = useAuthStore((state) => state.setLoginOpen);

  const createArticleReaction = useCreateArticleReaction();
  const updateArticleReaction = useUpdateArticleReaction();
  const deleteArticleReaction = useDeleteArticleReaction();

  const selectReaction = (reactionType: ReactionType) => {
    if (!user) {
      setLoginOpen();
      return;
    }

    const mutationVariables = {
      userId: user.id,
      articleId,
    };

    const mutationOptions = {
      onSuccess,
    };

    if (currentReaction === reactionType) {
      deleteArticleReaction.mutate(mutationVariables, mutationOptions);
      return;
    }

    if (currentReaction) {
      updateArticleReaction.mutate(
        { ...mutationVariables, reactionType },
        mutationOptions,
      );
      return;
    }

    createArticleReaction.mutate(
      { ...mutationVariables, reactionType },
      mutationOptions,
    );
  };

  return {
    selectReaction,
    isPending:
      createArticleReaction.isPending ||
      updateArticleReaction.isPending ||
      deleteArticleReaction.isPending,
  };
}

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ReactionType } from '../types';

interface UpdateArticleReactionVariables {
  userId: string;
  articleId: number;
  reactionType: ReactionType;
}

async function updateArticleReactionRequest(
  variables: UpdateArticleReactionVariables,
) {
  const response = await fetch('/api/article-reactions', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: variables.userId,
      articleId: variables.articleId,
      reactionType: variables.reactionType,
    }),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Failed to update article reaction' }));
    throw new Error(error.error || 'Failed to update article reaction');
  }

  const json = await response.json();
  return json.data;
}

type ArticleReactionRecord = {
  id: number;
  userId: string;
  articleId: number;
  reactionType: ReactionType;
  createdAt: string;
};

export function useUpdateArticleReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateArticleReactionRequest,
    onMutate: async (variables) => {
      const queryKey = ['article-reactions', variables.articleId];
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ArticleReactionRecord[]>(queryKey);
      queryClient.setQueryData<ArticleReactionRecord[]>(queryKey, (old = []) =>
        old.map((r) =>
          r.userId === variables.userId
            ? { ...r, reactionType: variables.reactionType }
            : r,
        ),
      );
      return { previous };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ['article-reactions', variables.articleId],
        context?.previous,
      );
      toast.error(err.message);
    },
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['article-reactions', variables.articleId],
      });
    },
  });
}

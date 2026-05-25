'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ReactionType } from '../types';

interface DeleteArticleReactionVariables {
  userId: string;
  articleId: number;
}

async function deleteArticleReactionRequest(
  variables: DeleteArticleReactionVariables,
) {
  const response = await fetch('/api/article-reactions', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: variables.userId,
      articleId: variables.articleId,
    }),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Failed to delete article reaction' }));
    throw new Error(error.error || 'Failed to delete article reaction');
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

export function useDeleteArticleReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteArticleReactionRequest,
    onMutate: async (variables) => {
      const queryKey = ['article-reactions', variables.articleId];
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ArticleReactionRecord[]>(queryKey);
      queryClient.setQueryData<ArticleReactionRecord[]>(queryKey, (old = []) =>
        old.filter((r) => r.userId !== variables.userId),
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

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

interface DeleteCommentReactionVariables {
  userId: string;
  commentId: number;
  articleId: number;
  replyTo?: number | null;
}

async function deleteCommentReactionRequest(
  variables: DeleteCommentReactionVariables,
) {
  const response = await fetch('/api/comment-reactions', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: variables.userId,
      commentId: variables.commentId,
    }),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Failed to delete comment reaction' }));
    throw new Error(error.error || 'Failed to delete comment reaction');
  }

  const json = await response.json();
  return json.data;
}

type ReactionRecord = {
  id: number;
  userId: string;
  commentId: number;
  reactionType: string;
  createdAt: string;
};

export function useDeleteCommentReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCommentReactionRequest,
    onMutate: async (variables) => {
      const queryKey = ['comment-reactions', variables.commentId];
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ReactionRecord[]>(queryKey);
      queryClient.setQueryData<ReactionRecord[]>(queryKey, (old = []) =>
        old.filter((r) => r.userId !== variables.userId),
      );
      return { previous };
    },
    onError: (_err, variables, context) => {
      queryClient.setQueryData(
        ['comment-reactions', variables.commentId],
        context?.previous,
      );
    },
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['comment-reactions', variables.commentId],
      });
      queryClient.invalidateQueries({
        queryKey: ['comments', String(variables.articleId)],
      });

      if (variables.replyTo) {
        queryClient.invalidateQueries({
          queryKey: ['replies', variables.replyTo],
        });
      }
    },
  });
}

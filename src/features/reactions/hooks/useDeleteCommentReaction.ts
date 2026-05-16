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

export function useDeleteCommentReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCommentReactionRequest,
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

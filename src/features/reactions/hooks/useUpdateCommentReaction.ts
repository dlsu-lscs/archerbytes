'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ReactionType } from '../types';

interface UpdateCommentReactionVariables {
  userId: string;
  commentId: number;
  reactionType: ReactionType;
  articleId: number;
  replyTo?: number | null;
}

async function updateCommentReactionRequest(
  variables: UpdateCommentReactionVariables,
) {
  const response = await fetch('/api/comment-reactions', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: variables.userId,
      commentId: variables.commentId,
      reactionType: variables.reactionType,
    }),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Failed to update comment reaction' }));
    throw new Error(error.error || 'Failed to update comment reaction');
  }

  const json = await response.json();
  return json.data;
}

type ReactionRecord = {
  id: number;
  userId: string;
  commentId: number;
  reactionType: ReactionType;
  createdAt: string;
};

export function useUpdateCommentReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCommentReactionRequest,
    onMutate: async (variables) => {
      const queryKey = ['comment-reactions', variables.commentId];
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ReactionRecord[]>(queryKey);
      queryClient.setQueryData<ReactionRecord[]>(queryKey, (old = []) =>
        old.map((r) =>
          r.userId === variables.userId
            ? { ...r, reactionType: variables.reactionType }
            : r,
        ),
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

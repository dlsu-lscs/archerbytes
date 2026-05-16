'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ReactionType } from '../types';

interface CreateCommentReactionVariables {
  userId: string;
  commentId: number;
  reactionType: ReactionType;
  articleId: number;
  replyTo?: number | null;
}

async function createCommentReactionRequest(
  variables: CreateCommentReactionVariables,
) {
  const response = await fetch('/api/comment-reactions', {
    method: 'POST',
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
      .catch(() => ({ error: 'Failed to create comment reaction' }));
    throw new Error(error.error || 'Failed to create comment reaction');
  }

  const json = await response.json();
  return json.data;
}

export function useCreateCommentReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCommentReactionRequest,
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

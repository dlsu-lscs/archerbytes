'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CommentRecord } from '../types';

interface DeleteCommentVariables {
  commentId: number;
  userId: string;
}

async function deleteCommentRequest(variables: DeleteCommentVariables) {
  const { commentId, userId } = variables;
  const response = await fetch(`/api/comments/${commentId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Failed to delete comment' }));
    throw new Error(error.error || 'Failed to delete comment');
  }

  const json: { data: CommentRecord } = await response.json();
  return json.data;
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCommentRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateCommentInput, CommentRecord } from '../types';

interface UpdateCommentVariables {
  commentId: number;
  userId: string;
  data: UpdateCommentInput;
}

async function updateCommentRequest(variables: UpdateCommentVariables) {
  const { commentId, data } = variables;
  const response = await fetch(`/api/comments/${commentId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Failed to update comment' }));
    throw new Error(error.error || 'Failed to update comment');
  }

  const json: { data: CommentRecord } = await response.json();
  return json.data;
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCommentRequest,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.setQueryData(['comment', result.id], result);
    },
  });
}

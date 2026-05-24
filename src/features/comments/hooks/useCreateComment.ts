'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  CreateCommentInput,
  CommentRecord,
} from '../types';

interface CreateCommentVariables {
  data: CreateCommentInput;
}

async function createCommentRequest(data: CreateCommentInput) {
  const response = await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Failed to create comment' }));
    throw new Error(error.error || 'Failed to create comment');
  }

  const json: { data: CommentRecord } = await response.json();
  return json.data;
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: CreateCommentVariables) =>
      createCommentRequest(data),
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['comments', String(variables.data.articleId)],
      });

      if (variables.data.replyTo) {
        queryClient.invalidateQueries({
          queryKey: ['replies', variables.data.replyTo],
        });
      }
    },
  });
}

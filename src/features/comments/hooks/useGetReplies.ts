'use client';

import { useQuery } from '@tanstack/react-query';
import type { CommentType } from '../types/comment.types';

async function fetchReplies(commentId: number): Promise<CommentType[]> {
  const response = await fetch(`/api/comments/${commentId}/replies`);

  if (!response.ok) {
    throw new Error('Failed to fetch replies');
  }

  const json = await response.json();
  return json.data.items;
}

interface UseGetRepliesOptions {
  enabled?: boolean;
}

export function useGetReplies(
  commentId: number,
  options?: UseGetRepliesOptions,
) {
  const query = useQuery<CommentType[], Error>({
    queryKey: ['replies', commentId],
    queryFn: () => fetchReplies(commentId),
    enabled: Boolean(commentId) && (options?.enabled ?? true),
  });

  return {
    ...query,
    data: query.data ?? [],
  };
}

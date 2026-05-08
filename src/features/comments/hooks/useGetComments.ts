'use client';

import { useQuery } from '@tanstack/react-query';
import type {
  CommentRecord,
  GetCommentsResponse,
} from '../types/comment.types';

async function fetchComments(articleId: number) {
  const response = await fetch(`/api/comments?articleId=${articleId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }

  const json: GetCommentsResponse = await response.json();
  return json.data;
}

export function useGetComments(articleId: string | undefined) {
  const query = useQuery<CommentRecord[], Error>({
    queryKey: ['comments', articleId],
    queryFn: () => fetchComments(articleId),
    enabled: Boolean(articleId),
  });

  return {
    ...query,
    data: query.data ?? [],
  };
}

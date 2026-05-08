'use client';

import { useQuery } from '@tanstack/react-query';
import type { CommentType } from '../types/comment.types';

interface GetCommentsResponse {
  data: CommentType[];
}

async function fetchComments(articleId: number): Promise<CommentType[]> {
  const response = await fetch(`/api/comments?articleId=${articleId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }

  const json: GetCommentsResponse = await response.json();
  return json.data;
}

export function useGetComments(articleId: string | undefined) {
  const query = useQuery<CommentType[], Error>({
    queryKey: ['comments', articleId],
    queryFn: () => fetchComments(Number(articleId)),
    enabled: Boolean(articleId),
  });

  const rootComments = query.data?.filter((c) => c.replyTo === null) ?? [];

  return {
    ...query,
    data: rootComments,
  };
}

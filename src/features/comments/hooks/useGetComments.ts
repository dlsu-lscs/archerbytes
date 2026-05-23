'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import type { CommentType } from '../types/comment.types';

const LIMIT = 10;

interface CommentsPage {
  items: CommentType[];
  total: number;
  limit: number;
  offset: number;
}

async function fetchComments(articleId: number, offset: number): Promise<CommentsPage> {
  const response = await fetch(
    `/api/comments?articleId=${articleId}&limit=${LIMIT}&offset=${offset}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }

  const json = await response.json();
  return json.data;
}

export function useGetComments(articleId: string | undefined) {
  const query = useInfiniteQuery<CommentsPage, Error>({
    queryKey: ['comments', articleId],
    queryFn: ({ pageParam }) => fetchComments(Number(articleId), pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + lastPage.limit;
      return nextOffset < lastPage.total ? nextOffset : undefined;
    },
    enabled: Boolean(articleId),
  });

  const data = query.data?.pages.flatMap((p) => p.items) ?? [];
  const total = query.data?.pages[0]?.total ?? 0;

  return {
    ...query,
    data,
    total,
  };
}

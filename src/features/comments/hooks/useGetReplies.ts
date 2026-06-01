'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import type { ApiPaginatedResponse } from '@/lib/api/response';
import type { CommentType } from '../types/comment.types';

const LIMIT = 5;

async function fetchReplies(
  commentId: number,
  page: number,
): Promise<ApiPaginatedResponse<CommentType>> {
  const offset = (page - 1) * LIMIT;
  const response = await fetch(
    `/api/comments/${commentId}/replies?limit=${LIMIT}&offset=${offset}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch replies');
  }

  return response.json();
}

interface UseGetRepliesOptions {
  enabled?: boolean;
  isExpanded?: boolean;
}

export function useGetReplies(
  commentId: number,
  options?: UseGetRepliesOptions,
) {
  const { enabled, isExpanded = false } = options ?? {};

  const query = useInfiniteQuery<ApiPaginatedResponse<CommentType>, Error>({
    queryKey: ['replies', commentId],
    queryFn: ({ pageParam }) => fetchReplies(commentId, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.pages
        ? lastPage.meta.page + 1
        : undefined,
    enabled: Boolean(commentId) && (enabled ?? true),
  });

  const { fetchNextPage, hasNextPage, isFetchingNextPage } = query;

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isExpanded) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isExpanded, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const data = query.data?.pages.flatMap((p) => p.data) ?? [];
  const total = query.data?.pages[0]?.meta.total ?? 0;

  return {
    ...query,
    data,
    total,
    sentinelRef,
  };
}

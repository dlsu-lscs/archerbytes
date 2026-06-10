'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/lib/auth/client';
import type { ReactionType } from '../types';
import type { CommentReactionSummary } from '@/features/comments/types/comment.types';

type ArticleReactionRecord = {
  id: number;
  userId: string;
  articleId: number;
  reactionType: ReactionType;
  createdAt: string;
};

type GetArticleReactionsResponse = {
  data: ArticleReactionRecord[];
};

function summarizeArticleReactions(
  reactions: ArticleReactionRecord[],
  currentUserId?: string,
): CommentReactionSummary {
  const counts: Partial<Record<ReactionType, number>> = {};

  for (const reaction of reactions) {
    counts[reaction.reactionType] = (counts[reaction.reactionType] ?? 0) + 1;
  }

  const topTypes = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type]) => type as ReactionType);

  const userReaction =
    reactions.find((reaction) => reaction.userId === currentUserId)
      ?.reactionType ?? null;

  return {
    total: reactions.length,
    counts,
    topTypes,
    userReaction,
  };
}

async function fetchArticleReactions(
  articleId: number,
): Promise<ArticleReactionRecord[]> {
  const response = await fetch(`/api/article-reactions?articleId=${articleId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch article reactions');
  }

  const json: GetArticleReactionsResponse = await response.json();
  return json.data;
}

interface UseGetArticleReactionsOptions {
  enabled?: boolean;
}

export function useGetArticleReactions(
  articleId: number,
  options?: UseGetArticleReactionsOptions,
) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const query = useQuery<ArticleReactionRecord[], Error>({
    queryKey: ['article-reactions', articleId],
    queryFn: () => fetchArticleReactions(articleId),
    enabled: Boolean(articleId) && (options?.enabled ?? true),
  });

  return {
    ...query,
    data: summarizeArticleReactions(query.data ?? [], userId),
    rawReactions: query.data ?? [],
    isEmpty: (query.data ?? []).length === 0,
  };
}

'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/lib/auth/client';
import type { ReactionType } from '../types';
import type { CommentReactionSummary } from '@/features/comments/types/comment.types';

type CommentReactionRecord = {
  id: number;
  userId: string;
  commentId: number;
  reactionType: ReactionType;
  createdAt: string;
};

type GetCommentReactionsResponse = {
  data: CommentReactionRecord[];
};

function summarizeCommentReactions(
  reactions: CommentReactionRecord[],
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

async function fetchCommentReactions(
  commentId: number,
): Promise<CommentReactionRecord[]> {
  const response = await fetch(`/api/comment-reactions?commentId=${commentId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch comment reactions');
  }

  const json: GetCommentReactionsResponse = await response.json();
  return json.data;
}

interface UseGetCommentReactionsOptions {
  enabled?: boolean;
}

export function useGetCommentReactions(
  commentId: number,
  options?: UseGetCommentReactionsOptions,
) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const query = useQuery<CommentReactionRecord[], Error>({
    queryKey: ['comment-reactions', commentId],
    queryFn: () => fetchCommentReactions(commentId),
    enabled: Boolean(commentId) && (options?.enabled ?? true),
  });

  return {
    ...query,
    data: summarizeCommentReactions(query.data ?? [], userId),
    rawReactions: query.data ?? [],
    isEmpty: (query.data ?? []).length === 0,
  };
}

'use client';

import {
  useGetCommentReactions,
  useCommentReactionSelection,
} from '../../hooks';
import ReactionPopover from './ReactionPopover';

interface CommentReactionPopoverProps {
  commentId?: number;
  articleId: number;
  replyTo?: number | null;
  fallbackCount: number;
}

export default function CommentReactionPopover({
  commentId,
  articleId,
  replyTo,
  fallbackCount,
}: CommentReactionPopoverProps) {
  const { data: reactionSummary, isFetched } = useGetCommentReactions(
    commentId ?? 0,
    {
      enabled: Boolean(commentId),
    },
  );

  const { selectReaction, isPending } = useCommentReactionSelection({
    commentId,
    articleId,
    replyTo: replyTo ?? null,
    currentReaction: reactionSummary.userReaction,
  });

  return (
    <ReactionPopover
      reactionSummary={reactionSummary}
      selectReaction={selectReaction}
      isPending={isPending}
      fallbackCount={fallbackCount}
      isFetched={isFetched}
      ariaLabel="React to comment"
    />
  );
}

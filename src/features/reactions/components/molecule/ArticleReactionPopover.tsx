'use client';

import { useGetArticleReactions, useArticleReactionSelection } from '../../hooks';
import ReactionPopover from './ReactionPopover';

interface ArticleReactionPopoverProps {
  articleId: number;
  fallbackCount: number;
}

export default function ArticleReactionPopover({
  articleId,
  fallbackCount,
}: ArticleReactionPopoverProps) {
  const { data: reactionSummary } = useGetArticleReactions(articleId);

  const { selectReaction, isPending } = useArticleReactionSelection({
    articleId,
    currentReaction: reactionSummary.userReaction,
  });

  return (
    <ReactionPopover
      reactionSummary={reactionSummary}
      selectReaction={selectReaction}
      isPending={isPending}
      fallbackCount={fallbackCount}
      ariaLabel="React to article"
    />
  );
}

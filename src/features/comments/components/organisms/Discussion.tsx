'use client';
import CommentItem from '@/features/comments/components/molecules/CommentItem';
import CommentForm from '../molecules/CommentForm';
import { useGetComments } from '../../hooks/useGetComments';

interface DiscussionProps {
  articleId: number;
}

export default function Discussion({ articleId }: DiscussionProps) {
  const { data, total, hasNextPage, isFetchingNextPage, sentinelRef } =
    useGetComments(String(articleId));

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-2xl font-bold text-neutral-950">
        Discussion ({total})
      </h3>
      <CommentForm articleId={articleId} expandable />
      <div className="flex flex-col gap-[10px]">
        {data.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            articleId={articleId}
          />
        ))}
      </div>
      <div
        ref={sentinelRef}
        className="py-2 text-center text-sm text-neutral-400"
      >
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
            ? ''
            : data.length > 0
              ? 'No more comments'
              : ''}
      </div>
    </div>
  );
}

'use client';
import CommentItem from '@/features/comments/components/molecules/CommentItem';
import DraftComment from './DraftComment';
import { useGetComments } from '../../hooks/useGetComments';

interface DiscussionProps {
  articleId: number;
}

export default function Discussion({ articleId }: DiscussionProps) {
  const { data } = useGetComments(String(articleId));

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-2xl font-bold text-neutral-950">
        Discussion ({data.length})
      </h3>
      <DraftComment articleId={articleId} />
      <div className="flex flex-col gap-[10px]">
        {data.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            articleId={articleId}
          />
        ))}
      </div>
    </div>
  );
}

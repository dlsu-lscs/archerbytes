'use client';

import CommentForm from '../molecules/CommentForm';

interface DraftCommentProps {
  articleId: number;
}

export default function DraftComment({ articleId }: DraftCommentProps) {
  return <CommentForm articleId={articleId} expandable />;
}

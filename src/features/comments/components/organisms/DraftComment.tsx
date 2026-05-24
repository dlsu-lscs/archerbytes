'use client';
import { Button } from '@/components/ui/button';
import { useDraftCommentOpen } from '../../hooks';

import CommentForm from '../molecules/CommentForm';

interface DraftCommentProps {
    articleId: number;
}

export default function DraftComment({ articleId }: DraftCommentProps) {

    return (
        <CommentForm articleId={articleId} expandable />
    );
}

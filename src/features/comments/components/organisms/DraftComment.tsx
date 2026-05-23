'use client';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useDraftCommentOpen } from '../../hooks';

import CommentForm from '../molecules/CommentForm';

interface DraftCommentProps {
    articleId: number;
}

export default function DraftComment({ articleId }: DraftCommentProps) {
    const { isOpen, onOpenChange } = useDraftCommentOpen();

    return (
        <Collapsible
            className="flex flex-col gap-5"
            open={isOpen}
            onOpenChange={onOpenChange}
        >
            <CollapsibleTrigger className="py-6 px-5 w-full justify-start text-neutral-950 bg-neutral-300 rounded-sm">
                Share your thoughts here...
            </CollapsibleTrigger>
            <CollapsibleContent>
                <CommentForm articleId={articleId} />
            </CollapsibleContent>
        </Collapsible>
    );
}

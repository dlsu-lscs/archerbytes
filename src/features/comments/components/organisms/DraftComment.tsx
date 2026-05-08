'use client';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';

import Comment from '../molecules/Comment';
import { useAuthStore } from '@/store/use-auth-store';

export default function DraftComment() {
    const user = useAuthStore((state) => state.user);

    const draft = user
        ? {
            articleId: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            user: {
                id: user.id,
                name: user.name || 'Guest',
                avatarURL: user.image,
                email: user.email,
            },
            isAuthor: false,
            content: '',
            reactionCount: 0,
            replyCount: 0,
        }
        : undefined;

    return (
        <Collapsible className="flex flex-col gap-5">
            <CollapsibleTrigger className="py-6 px-5 w-full justify-start text-neutral-950 bg-neutral-300 rounded-sm">
                Share your thoughts here...
            </CollapsibleTrigger>
            <CollapsibleContent>
                <Comment comment={draft} isDraft={true} />
            </CollapsibleContent>
        </Collapsible>
    );
}

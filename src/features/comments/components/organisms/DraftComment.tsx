'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';

import Comment from '../molecules/Comment';

export default function DraftComment() {
    const [isOpen, setIsOpen] = useState(false);

    const comment1 = {
        avatarURL: '/lscs-logo.png',
        userId: 'Alec Nono',
        occupation: 'Frontend Engineer',
        isAuthor: false,
        content: 'I love LSCS! Pogi talaga mga nasa Research and Development',
        likeCount: 5000,
        replyCount: 10,
    };

    return (
        <Collapsible className="flex flex-col gap-5">
            <CollapsibleTrigger>
                <Button className="py-6 px-5 w-full justify-start text-neutral-950 bg-neutral-300 rounded-sm">
                    Share your thoughts here...
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <Comment comment={comment1} isDraft={true} />
            </CollapsibleContent>
        </Collapsible>
    );
}

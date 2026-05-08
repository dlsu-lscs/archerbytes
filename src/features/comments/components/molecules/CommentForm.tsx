'use client';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

import { useAuthStore } from '@/store/use-auth-store';
import { useCreateComment } from '../../hooks/useCreateComment';

interface CommentFormProps {
    articleId: number;
    replyTo?: number | null;
    onSuccess?: () => void;
    placeholder?: string;
    buttonText?: string;
}

export default function CommentForm({
    articleId,
    replyTo,
    onSuccess,
    placeholder = 'Share your thoughts here...',
    buttonText = 'Post',
}: CommentFormProps) {
    const [content, setContent] = useState('');

    const user = useAuthStore((state) => state.user);
    const createComment = useCreateComment();

    const handleSubmit = () => {
        if (!user) {
            useAuthStore.getState().setLoginOpen();
            return;
        }

        if (!content.trim()) return;

        createComment.mutate(
            {
                data: {
                    userId: user.id,
                    articleId,
                    content: content.trim(),
                    replyTo: replyTo ?? null,
                },
            },
            {
                onSuccess: () => {
                    setContent('');
                    onSuccess?.();
                },
            },
        );
    };

    return (
        <Card>
            <CardContent className="flex rounded-2xl relative">
                <Image
                    className="size-8 md:size-12 my-[3px] shrink-0 rounded-full mr-3 z-30"
                    height={128}
                    width={128}
                    src={user?.image || ''}
                    alt="Avatar"
                />
                <div className="flex flex-col gap-3 w-full">
                    <Textarea
                        className="resize-none min-h-6 py-6 px-5 rounded-sm"
                        placeholder={placeholder}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <div className="flex justify-end">
                        <Button
                            className="px-10 w-fit"
                            onClick={handleSubmit}
                            disabled={createComment.isPending || !content.trim()}
                        >
                            {createComment.isPending ? 'Posting...' : buttonText}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

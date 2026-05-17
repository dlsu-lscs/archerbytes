'use client';

import { type ComponentType, useMemo, useState } from 'react';
import {
    Angry,
    Frown,
    HandHeart,
    Heart,
    Laugh,
    Sparkles,
    ThumbsUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
    useCommentReactionSelection,
    useGetCommentReactions,
} from '../../hooks';
import { reactionTypes, type ReactionType } from '../../types';

interface CommentReactionPopoverProps {
    commentId?: number;
    articleId: number;
    replyTo?: number | null;
    fallbackCount: number;
}

const reactionMeta: Record<
    ReactionType,
    {
        Icon: ComponentType<{ className?: string; size?: number }>;
        label: string;
        iconToneClassName: string;
        circleToneClassName: string;
    }
> = {
    like: {
        Icon: ThumbsUp,
        label: 'Like',
        iconToneClassName: 'text-[#1e66f5]',
        circleToneClassName: 'bg-[#89b4fa]',
    },
    heart: {
        Icon: Heart,
        label: 'Heart',
        iconToneClassName: 'text-[#d20f39]',
        circleToneClassName: 'bg-[#f38ba8]',
    },
    care: {
        Icon: HandHeart,
        label: 'Care',
        iconToneClassName: 'text-[#40a02b]',
        circleToneClassName: 'bg-[#a6e3a1]',
    },
    haha: {
        Icon: Laugh,
        label: 'Haha',
        iconToneClassName: 'text-[#df8e1d]',
        circleToneClassName: 'bg-[#f9e2af]',
    },
    wow: {
        Icon: Sparkles,
        label: 'Wow',
        iconToneClassName: 'text-[#8839ef]',
        circleToneClassName: 'bg-[#cba6f7]',
    },
    sad: {
        Icon: Frown,
        label: 'Sad',
        iconToneClassName: 'text-[#179299]',
        circleToneClassName: 'bg-[#94e2d5]',
    },
    angry: {
        Icon: Angry,
        label: 'Angry',
        iconToneClassName: 'text-[#d9480f]',
        circleToneClassName: 'bg-[#fab387]',
    },
};

export default function CommentReactionPopover({
    commentId,
    articleId,
    replyTo,
    fallbackCount,
}: CommentReactionPopoverProps) {
    const [isOpen, setIsOpen] = useState(false);

    const { data: reactionSummary } = useGetCommentReactions(commentId ?? 0, {
        enabled: Boolean(commentId),
    });

    const { selectReaction, isPending } = useCommentReactionSelection({
        commentId,
        articleId,
        replyTo: replyTo ?? null,
        currentReaction: reactionSummary.userReaction,
        onSuccess: () => setIsOpen(false),
    });

    const topReactions = reactionSummary.topTypes.slice(0, 3);

    const totalReactionCount = reactionSummary.total || fallbackCount;

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 rounded-md px-2 text-muted-foreground hover:text-foreground"
                    aria-label="Open reaction picker"
                >
                    {topReactions.length > 0 ? (
                        <div className="flex items-center">
                            {topReactions.map((reactionType, index) => {
                                const { Icon, iconToneClassName, circleToneClassName } =
                                    reactionMeta[reactionType];

                                return (
                                    <span
                                        key={reactionType}
                                        className={cn(
                                            'inline-flex size-5 items-center justify-center rounded-full ring-1 ring-border/70',
                                            iconToneClassName,
                                            circleToneClassName,
                                            index > 0 && '-ml-1',
                                        )}
                                        aria-hidden
                                    >
                                        <Icon size={11} />
                                    </span>
                                );
                            })}
                        </div>
                    ) : (
                        <ThumbsUp size={16} />
                    )}
                    <span className="text-xs font-medium">{totalReactionCount}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-fit rounded-lg p-2">
                <div className="flex items-center gap-1.5">
                    {reactionTypes.map((reactionType) => {
                        const isSelected = reactionSummary.userReaction === reactionType;
                        const { Icon, label, iconToneClassName, circleToneClassName } =
                            reactionMeta[reactionType];

                        return (
                            <button
                                key={reactionType}
                                type="button"
                                className={cn(
                                    'flex items-center justify-center rounded-md border border-transparent p-1.5 transition-colors',
                                    isSelected
                                        ? 'bg-accent text-accent-foreground border-border'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                                )}
                                onClick={() => selectReaction(reactionType)}
                                disabled={isPending}
                                aria-label={label}
                            >
                                <span
                                    className={cn(
                                        'inline-flex size-7 items-center justify-center rounded-full ring-1 ring-border/70',
                                        iconToneClassName,
                                        circleToneClassName,
                                    )}
                                >
                                    <Icon size={15} />
                                </span>
                            </button>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
}

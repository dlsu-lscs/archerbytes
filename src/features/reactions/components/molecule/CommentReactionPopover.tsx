'use client';

import { useRef, useState, useCallback, useEffect, type ComponentType } from 'react';
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
import { Button } from '@/components/ui/button';
import {
    useCommentReactionSelection,
    useGetCommentReactions,
} from '../../hooks';
import { reactionTypes, type ReactionType } from '../../types';
import { useAuthStore } from '@/store/use-auth-store';
import { useSession } from '@/lib/auth/client';

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

    const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const longPressDetectedRef = useRef(false);

    const { data: session } = useSession();
    const user = session?.user;
    const setLoginOpen = useAuthStore((state) => state.setLoginOpen);

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

    useEffect(() => {
        return () => {
            if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
            if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
            if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
        };
    }, []);

    const openPicker = useCallback(() => {
        if (!user) {
            setLoginOpen();
            return;
        }
        setIsOpen(true);
    }, [user, setLoginOpen]);

    const closePicker = useCallback(() => setIsOpen(false), []);

    // Desktop: hover on wrapper opens picker after delay
    const handleMouseEnter = () => {
        if (closeTimerRef.current) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null; }
        hoverTimerRef.current = setTimeout(openPicker, 800);
    };

    const handleMouseLeave = () => {
        if (hoverTimerRef.current) { clearTimeout(hoverTimerRef.current); hoverTimerRef.current = null; }
        closeTimerRef.current = setTimeout(closePicker, 300);
    };

    const handlePickerMouseEnter = () => {
        if (closeTimerRef.current) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null; }
    };

    // Mobile: long press opens picker
    const handlePointerDown = (e: React.PointerEvent) => {
        if (e.pointerType === 'mouse') return;
        longPressDetectedRef.current = false;
        longPressTimerRef.current = setTimeout(() => {
            longPressDetectedRef.current = true;
            openPicker();
        }, 500);
    };

    const cancelLongPress = (e: React.PointerEvent) => {
        if (e.pointerType === 'mouse') return;
        if (longPressTimerRef.current) { clearTimeout(longPressTimerRef.current); longPressTimerRef.current = null; }
    };

    // Click = quick like toggle; ignored when triggered by a long press
    const handleClick = () => {
        if (longPressDetectedRef.current) {
            longPressDetectedRef.current = false;
            return;
        }
        selectReaction('like');
    };

    const topReactions = reactionSummary.topTypes.slice(0, 3);
    const totalReactionCount = reactionSummary.total || fallbackCount;
    const userReaction = reactionSummary.userReaction;

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                    'h-8 gap-2 rounded-md px-2',
                    userReaction
                        ? reactionMeta[userReaction].iconToneClassName
                        : 'text-muted-foreground hover:text-foreground',
                )}
                onClick={handleClick}
                onPointerDown={handlePointerDown}
                onPointerUp={cancelLongPress}
                onPointerCancel={cancelLongPress}
                onContextMenu={(e) => e.preventDefault()}
                disabled={isPending}
                aria-label="React to comment"
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

            {isOpen && (
                <div
                    className="absolute bottom-full left-0 z-50 mb-1 flex items-center gap-1.5 rounded-lg border bg-popover p-2 shadow-md"
                    onMouseEnter={handlePickerMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {reactionTypes.map((reactionType) => {
                        const isSelected = userReaction === reactionType;
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
            )}
        </div>
    );
}

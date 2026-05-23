'use client';
import { useEffect, useRef } from 'react';
import CommentItem from '@/features/comments/components/molecules/CommentItem';
import CommentForm from '../molecules/CommentForm';
import { useGetComments } from '../../hooks/useGetComments';

interface DiscussionProps {
    articleId: number;
}

export default function Discussion({ articleId }: DiscussionProps) {
    const { data, total, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useGetComments(String(articleId));

    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 },
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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
            <div ref={sentinelRef} className="py-2 text-center text-sm text-neutral-400">
                {isFetchingNextPage ? 'Loading more...' : hasNextPage ? '' : data.length > 0 ? 'No more comments' : ''}
            </div>
        </div>
    );
}

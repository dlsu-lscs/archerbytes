'use client'

import TopicChip from './TopicChip';
import { SmallArticleItemType } from '@/features/article/types/article.types';

import BookmarkButton from '@/features/bookmarks/components/atoms/BookmarkButton';
import useBookmarks from '@/features/bookmarks/queries/useBookmarks';
import useCreateBookmark from '@/features/bookmarks/queries/useCreateBookmark';
import useDeleteBookmark from '@/features/bookmarks/queries/useDeleteBookmark';
import { useAuthStore } from '@/store/use-auth-store';

export default function SmallArticleItem({
    id,
    topic,
    title,
    author,
    date,
}: SmallArticleItemType) {
    const { data: bookmarks, error: authError } = useBookmarks();
    const addBookmark = useCreateBookmark();
    const deleteBookmark = useDeleteBookmark();
    
    const isBookmarked = bookmarks?.some((bookmark) => bookmark.articleId === id) || false;
    const isPending = addBookmark.isPending || deleteBookmark.isPending;
    const setLoginOpen = useAuthStore((state) => state.setLoginOpen);

    const handleToggleBookmark = () => {
        if (authError?.message === 'Unauthorized') {
            setLoginOpen();
            return;
        }

        if(isBookmarked) {
            deleteBookmark.mutate(id);
        } else {
            addBookmark.mutate(id);
        }
    }

    return (
        <div className="flex flex-col gap-1 text-neutral-950">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="size-4 shrink-0 rounded-full bg-neutral-400"></div>
                    <p className="font-light text-xs">{author}</p>
                </div>
                <BookmarkButton 
                    isBookmarked={isBookmarked} 
                    onToggle={handleToggleBookmark} 
                    disabled={isPending} 
                    size='small'
                />
            </div>
            <h6 className="text-md font-bold align-middle">{title}</h6>
            <div className="flex gap-2">
                <TopicChip>{topic}</TopicChip>
                <p className="text-xs font-light">{date}</p>
            </div>
        </div>
    );
}

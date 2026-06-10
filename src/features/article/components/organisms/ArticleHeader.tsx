'use client';

import Breadcrumbs from '@/features/article/components/atoms/Breadcrumbs';
import Keywords from '@/features/article/components/atoms/Keywords';
import ArticleDetails from '../molecules/ArticleDetails';
import { ArticleDetailsType } from '@/features/article/types/article.types';
import { ImBubble } from 'react-icons/im';
import ArticleReactionPopover from '@/features/reactions/components/molecule/ArticleReactionPopover';
import BookmarkButton from '@/features/bookmarks/components/atoms/BookmarkButton';
import useBookmarks from '@/features/bookmarks/queries/useBookmarks';
import useCreateBookmark from '@/features/bookmarks/queries/useCreateBookmark';
import useDeleteBookmark from '@/features/bookmarks/queries/useDeleteBookmark';
import { useAuthStore } from '@/store/use-auth-store';

interface ArticleHeaderProps {
    article: ArticleDetailsType;
}

export default function ArticleHeader({ article }: ArticleHeaderProps) {


    const { data: bookmarks, error: authError } = useBookmarks();
    const addBookmark = useCreateBookmark();
    const deleteBookmark = useDeleteBookmark();

    const isBookmarked =
        bookmarks?.some((bookmark) => bookmark.articleId === article.id) || false;
    const isPending = addBookmark.isPending || deleteBookmark.isPending;
    const setLoginOpen = useAuthStore((state) => state.setLoginOpen);

    const handleToggleBookmark = () => {
        if (authError?.message === 'Unauthorized') {
            setLoginOpen();
            return;
        }

        if (isBookmarked) {
            deleteBookmark.mutate(article.id);
        } else {
            addBookmark.mutate(article.id);
        }
    };

    return (
        <div className="flex flex-col gap-[10px] pt-3 mb-3 h-max">
            <Breadcrumbs link={`Home > ${article.category.name} > ${article.title}`} />
            <ArticleDetails article={article} />
            <Keywords article={article} />
            <div className="flex gap-5 text-neutral-950 text-sm">
                <div className="flex gap-2 items-center">
                    <ArticleReactionPopover
                        articleId={article.id}
                        fallbackCount={article.reactionCount ?? 0}
                    />
                    <p className='hidden md:block'>Like this article</p>
                </div>
                <a href='#discussion' className="flex gap-2 items-center text-muted-foreground hover:text-primary transition-colors" onClick={(e) => { e.preventDefault(); document.getElementById('discussion')?.scrollIntoView({ behavior: 'smooth' }); }}>
                    <ImBubble size={24} />
                    <p className='hidden md:block'>Reply to this article</p>
                </a>
                <div className="flex gap-2 items-center cursor-pointer hover:text-primary transition-colors">
                    <BookmarkButton
                        isBookmarked={isBookmarked}
                        onToggle={handleToggleBookmark}
                        disabled={isPending}
                        size="large"
                    >
                        <p className='hidden md:block'>{isBookmarked ? 'Saved' : 'Save article'}</p>
                    </BookmarkButton>
                </div>
            </div>
        </div>
    );
}

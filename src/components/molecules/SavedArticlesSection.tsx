import Image from 'next/image';
import SmallArticleItem from '@/features/article/components/atoms/SmallArticleItem';
import Link from 'next/link';
import { BookmarkType } from '@/features/bookmarks/types/bookmarks.types';

interface SavedArticlesSectionProps {
  bookmarks?: BookmarkType[];
  isLoading: boolean;
  isError: boolean
  isAuthenticated: boolean;
  pathname: string;
}

export default function SavedArticlesSection({bookmarks, isLoading, isError, isAuthenticated, pathname}: SavedArticlesSectionProps) {
  const displayedBookmarks = bookmarks?.slice(0, 3) || [];
  const totalSaved = bookmarks?.length || 0;

  if (pathname === '/bookmarks' || !isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex justify-between items-center text-primary">
        <div className="flex gap-2 items-center">
          <Image
            src={'/read_later.webp'}
            height={24}
            width={24}
            alt="Read Later"
          />
          <h6 className="font-medium text-md">Read Later</h6>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        {isLoading ? (
          <div className="animate-pulse flex flex-col gap-4">
            <div className="h-16 bg-neutral-300 rounded-md"></div>
            <div className="h-16 bg-neutral-300 rounded-md"></div>
          </div>
        ) : isError ? (
          <p className="text-sm text-neutral-500 text-center mt-3">Failed to load saved articles</p>
        ) : displayedBookmarks.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center mt-3">No saved articles yet</p>
        ) : (
          displayedBookmarks?.map((bookmark) => {
            const formattedDate = new Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: 'numeric',
            }).format(
              bookmark.bookmarkedAt
                ? new Date(bookmark.bookmarkedAt)
                : new Date(),
            );

            return (
              <SmallArticleItem
                key={bookmark.id}
                id={bookmark.articleId}
                topic={bookmark.article.category.name}
                title={bookmark.article.title}
                author={bookmark.article.author.name}
                date={formattedDate}
                avatarURL={bookmark.article.author?.avatarURL}
                slug={bookmark.article.slug}
              />
            );
          })
        )}
      </div>

      {totalSaved > 3 && (
        <Link href="/bookmarks">
          <p className="text-sm font-light text-primary hover:underline cursor-pointer mt-2">
            See all ({totalSaved})
          </p>
        </Link>
      )}
    </div>
  );
}

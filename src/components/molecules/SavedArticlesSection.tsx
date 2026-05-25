import Image from 'next/image';
import SmallArticleItem from '../atoms/SmallArticleItem';
import Link from 'next/link';
import { BookmarkType } from '@/features/bookmarks/types/bookmarks.types';

interface SavedArticlesSectionProps {
  bookmarks?: BookmarkType[];
  isLoading: boolean;
  isAuthenticated: boolean;
  pathname: string;
}

export default function SavedArticlesSection({bookmarks, isLoading, isAuthenticated, pathname}: SavedArticlesSectionProps) {
  const displayedBookmarks = bookmarks?.slice(0, 3) || [];
  const totalSaved = bookmarks?.length || 0;

  if (pathname === '/bookmarks' || !isAuthenticated) {
    return null;
  }

  if (!isLoading && (!bookmarks || bookmarks.length === 0)) {
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
        <p className="font-light text-md">Clear</p>
      </div>
      <div className="flex flex-col gap-6">
        {isLoading ? (
          <div className="animate-pulse flex flex-col gap-4">
            <div className="h-16 bg-gray-200 rounded-md"></div>
            <div className="h-16 bg-gray-200 rounded-md"></div>
          </div>
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

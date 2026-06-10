import Link from 'next/link';
import Image from 'next/image';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { LuCircleMinus } from 'react-icons/lu';
import { FaRegCalendar } from 'react-icons/fa6';
import { ImBubble } from 'react-icons/im';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BookmarkButton from '@/features/bookmarks/components/atoms/BookmarkButton';
import useBookmarks from '@/features/bookmarks/queries/useBookmarks';
import useAddBookmark from '@/features/bookmarks/queries/useCreateBookmark';
import useDeleteBookmark from '@/features/bookmarks/queries/useDeleteBookmark';
import { useAuthStore } from '@/store/use-auth-store';
import { ArticleDetailsProp } from '@/features/article/types/article.types';
import ArticleReactionPopover from '@/features/reactions/components/molecule/ArticleReactionPopover';

export default function ArticleItem({ article }: ArticleDetailsProp) {
  const { data: bookmarks, error: authError } = useBookmarks();
  const addBookmark = useAddBookmark();
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
    <Card className="rounded-2xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden gap-0">
      {/* Action bar — outside the link so clicks don't navigate */}
      <div className="flex justify-between items-center px-5 pb-4">
        <Badge variant="secondary" className="text-xs font-medium">
          {article.category.name}
        </Badge>
        <div className="flex items-center gap-1 text-muted-foreground">
          <button
            className="p-1 rounded hover:bg-accent hover:text-foreground transition-colors"
            aria-label="Not interested"
          >
            <LuCircleMinus size={16} />
          </button>
          <BookmarkButton
            isBookmarked={isBookmarked}
            onToggle={handleToggleBookmark}
            disabled={isPending}
            size="medium"
          />
          <button
            className="p-1 rounded hover:bg-accent hover:text-foreground transition-colors"
            aria-label="More options"
          >
            <HiOutlineDotsHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Card body — the whole thing is a link */}
      <Link href={`/articles/${article.slug}`}>
        <CardContent className="flex justify-between items-start gap-6 px-5 py-0">
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div className="flex gap-2 items-center">
              <Image
                className="hidden md:block size-5 shrink-0 rounded-full object-cover"
                height={128}
                width={128}
                src={article.author.avatarURL || '/lscs-logo.png'}
                alt="Avatar"
              />
              <p className="text-sm font-medium text-muted-foreground truncate">
                {article.author.name}
              </p>
              <p className="text-sm font-medium text-muted-foreground">{'•'}</p>
              <div className="flex gap-1 items-center h-8 text-xs font-medium text-muted-foreground">
                <FaRegCalendar size={13} />
                <span>
                  {article.publishedAt.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-base leading-snug line-clamp-2">
                {article.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {article.subtitle}
              </p>
            </div>
          </div>

          {article.featuredImageUrl && (
            <Image
              className="hidden md:block w-36 aspect-video shrink-0 rounded-xl object-cover"
              height={480}
              width={854}
              src={article.featuredImageUrl}
              alt="Preview"
            />
          )}
        </CardContent>
      </Link>

      {/* Footer — outside the link so reactions are interactive */}
      <div className="flex items-center gap-1 px-4 pt-1 text-muted-foreground text-xs">
        <ArticleReactionPopover
          articleId={article.id}
          fallbackCount={article.reactionCount}
        />
        <div className="flex gap-1 items-center px-2 h-8">
          <ImBubble size={14} />
          <span>{article.commentCount}</span>
        </div>
      </div>
    </Card>
  );
}

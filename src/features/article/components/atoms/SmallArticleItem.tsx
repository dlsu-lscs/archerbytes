'use client';

import TopicChip from './TopicChip';
import { SmallArticleItemType } from '@/features/article/types/article.types';

import BookmarkButton from '@/features/bookmarks/components/atoms/BookmarkButton';
import useBookmarks from '@/features/bookmarks/queries/useBookmarks';
import useCreateBookmark from '@/features/bookmarks/queries/useCreateBookmark';
import useDeleteBookmark from '@/features/bookmarks/queries/useDeleteBookmark';
import { useAuthStore } from '@/store/use-auth-store';
import Image from 'next/image';
import Link from 'next/link';

export default function SmallArticleItem({
  id,
  topic,
  title,
  author,
  date,
  avatarURL,
  slug,
}: SmallArticleItemType) {
  const { data: bookmarks, error: authError } = useBookmarks();
  const addBookmark = useCreateBookmark();
  const deleteBookmark = useDeleteBookmark();

  const isBookmarked =
    bookmarks?.some((bookmark) => bookmark.articleId === id) || false;
  const isPending = addBookmark.isPending || deleteBookmark.isPending;
  const setLoginOpen = useAuthStore((state) => state.setLoginOpen);

  const handleToggleBookmark = () => {
    if (authError?.message === 'Unauthorized') {
      setLoginOpen();
      return;
    }

    if (isBookmarked) {
      deleteBookmark.mutate(id);
    } else {
      addBookmark.mutate(id);
    }
  };

  return (
    <div className="flex flex-col gap-1 text-neutral-950">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src={avatarURL || '/lscs-logo.png'}
            alt={`${author}'s avatar`}
            width={16}
            height={16}
            className="size-4 shrink-0 rounded-full object-cover bg-neutral-200"
          />
          <p className="font-light text-xs">{author}</p>
        </div>
        <BookmarkButton
          isBookmarked={isBookmarked}
          onToggle={handleToggleBookmark}
          disabled={isPending}
          size="small"
        />
      </div>
      <Link href={`/articles/${slug}`}>
        <h6 className="text-md font-bold align-middle hover:underline">
          {title}
        </h6>
      </Link>
      <div className="flex gap-2">
        <TopicChip>{topic}</TopicChip>
        <p className="text-xs font-light">{date}</p>
      </div>
    </div>
  );
}

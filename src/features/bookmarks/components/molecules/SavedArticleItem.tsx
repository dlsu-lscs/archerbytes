import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { LuCircleMinus } from 'react-icons/lu';

import {
    Card,
    CardContent,
} from '@/components/ui/card';

import { BookmarkType } from '../../types/bookmarks.types';
import useDeleteBookmark from '../../queries/useDeleteBookmark';
import BookmarkButton from '../atoms/BookmarkButton';

interface SavedArticleItemProps {
    bookmark: BookmarkType;
}

export default function SavedArticleItem({bookmark}: SavedArticleItemProps) {
    const deleteBookmark = useDeleteBookmark();

  const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(bookmark.bookmarkedAt);

  return (
      <Card className="flex flex-col px-8 py-10 gap-0 border-0 shadow-none rounded-none border-b-2 border-solid">
          <div className="flex justify-end items-center gap-1 mb-3 text-muted-foreground">
              <LuCircleMinus className="cursor-pointer hover:text-foreground" />
              <BookmarkButton 
                  isBookmarked={true}
                  onToggle={() => deleteBookmark.mutate(bookmark.articleId)}
                  disabled={deleteBookmark.isPending}
              />
              <HiOutlineDotsHorizontal className="cursor-pointer hover:text-foreground" />
          </div>
          
          <div className="flex justify-between items-center gap-12">
              <CardContent className="flex flex-col gap-2 p-0 w-full">
                  <div>
                      <h5 className="font-bold text-lg cursor-pointer hover:underline">
                          {bookmark.article.title}
                      </h5>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {bookmark.article.excerpt}
                      </p>
                  </div>
                  
                  <div className="text-xs text-muted-foreground mt-2 font-medium">
                      Saved on {formattedDate}
                  </div>
              </CardContent>
          </div>
      </Card>
  );
}
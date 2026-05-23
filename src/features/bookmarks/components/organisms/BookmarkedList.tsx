'use client'

import SavedArticleItem from "../molecules/SavedArticleItem";
import ArticleItemSkeleton from "@/features/landing/components/atoms/ArticleItemSkeleton";
import useBookmarkedArticles from "../../queries/useBookmarks";

export default function BookmarkedList() {
  const {data: bookmarks, isLoading, isError} = useBookmarkedArticles();

  return (
    <div>
      {isError && (
          <p className="text-red-500">
              Failed to load your bookmarks. Please try again later.
          </p>
      )}

      {isLoading && (
        <>
          <ArticleItemSkeleton/>
          <ArticleItemSkeleton/>
          <ArticleItemSkeleton/>
        </>
      )}

      {!isLoading && !isError && bookmarks?.length === 0 && (
          <div className="text-center py-10 text-gray-500">
              <p>You haven't saved any articles yet.</p>
          </div>
      )}

      {!isLoading && !isError && bookmarks && bookmarks.length > 0 && (
          <div className="flex flex-col">
              {bookmarks.map((bookmark) => (
                <SavedArticleItem key={bookmark.id} bookmark={bookmark} />
              ))}
          </div>
      )}
</div>
  )
}
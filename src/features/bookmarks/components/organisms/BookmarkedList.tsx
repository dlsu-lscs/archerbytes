'use client'

import ArticleItem from "@/features/landing/components/molecules/ArticleItem";
import ArticleItemSkeleton from "@/features/landing/components/atoms/ArticleItemSkeleton";
import useBookmarks from "../../queries/useBookmarks";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function BookmarkedList() {
  const router = useRouter();
  const {data: bookmarks, isLoading, isError, error} = useBookmarks();

  useEffect(() => {
    if(isError && error?.message === 'Unauthorized') {
      toast.error("Please log in to view your bookmarks.");
      router.push('/login');
    }
  }, [isError, error, router]);

  if(isError && error?.message === 'Unauthorized'){
    return(
      <div className="text-center py-10 text-gray-500">
        Redirecting to login...
      </div>
    )
  }

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
              <p>You haven&apos;t saved any articles yet.</p>
          </div>
      )}

      {!isLoading && !isError && bookmarks && bookmarks.length > 0 && (
          <div className="flex flex-col gap-2">
              {bookmarks.map((bookmark) => (
                <ArticleItem key={bookmark.id} article={bookmark.article} />
              ))}
          </div>
      )}
</div>
  )
}
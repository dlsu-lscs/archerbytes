import { useMutation, useQueryClient, QueryKey } from "@tanstack/react-query";
import { BookmarkType, BookmarkMetaType } from "../types/bookmarks.types";
import { toast } from "sonner";

const queryKey: QueryKey = ['bookmarks']

interface CacheData {
  data: BookmarkType[];
  meta: BookmarkMetaType;
}

export default function useAddBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articleId: number) => addBookmark(articleId),
    onMutate: async (articleId) => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<CacheData>(queryKey);

      if(previousState) {
        queryClient.setQueryData<CacheData>(queryKey, (prev) => {
          if(!prev) return prev;
          const optimisticBookmark: BookmarkType = {
            id: Date.now(),
            articleId: articleId,
            userId: 'temp-user',
            bookmarkedAt: new Date(),
            createdAt: new Date(),
            article: {
                id: articleId,
                title: 'Saving Article...',
                slug: '',
                excerpt: ''
            }
          };

          return {
            ...prev,
            data: [...prev.data, optimisticBookmark]
          };
        });
      }

      return {previousState};
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousState);
      toast.error("Failed to save article. Please try again");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  })
}

const addBookmark = async (articleId: number) => {
  const res = await fetch('/api/bookmarks', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({articleId}),
  });

  if(!res.ok){
    throw new Error('Failed to bookmark article');
  }

  return res.json();
}
import { useMutation, useQueryClient, QueryKey } from "@tanstack/react-query";
import { BookmarkType } from "../types/bookmarks.types";

const queryKey: QueryKey = ['bookmarks'];

interface CacheData {
  data: BookmarkType[];
  meta?: any;
}

export default function useDeleteBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articleId: number) => deleteBookmark(articleId),
    onMutate: async (articleId) => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<CacheData>(queryKey);

      if(previousState){
        queryClient.setQueryData<CacheData>(queryKey, (prev) => {
          if(!prev) return prev;
          return {
            ...prev,
            data: prev.data.filter((bookmark) => bookmark.articleId !== articleId)
          }
        });
      }

      return {previousState};
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousState);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  })
}

const deleteBookmark = async (articleId: number) => {
  const res = await fetch(`/api/bookmarks?articleId=${articleId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Failed to remove bookmark');
  }
}
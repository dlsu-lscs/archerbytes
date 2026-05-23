import { useMutation, useQueryClient, QueryKey } from "@tanstack/react-query";
import { BookmarkType } from "../types/bookmarks.types";
import { toast } from "sonner";

const queryKey: QueryKey = ['bookmarks']

interface CacheData {
  data: BookmarkType[];
  meta?: any;
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
          return {
            ...prev,
            data: [
              ...prev.data,
              { articleId } as BookmarkType 
            ]
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
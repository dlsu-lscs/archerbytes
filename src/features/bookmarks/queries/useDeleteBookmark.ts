import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookmarkType } from "../types/bookmarks.types";

export default function useDeleteBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articleId: number) => deleteBookmark(articleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
    onError: (error) => {
      console.error(error.message);
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
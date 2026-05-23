import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookmarkType } from "../types/bookmarks.types";

export default function useAddBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articleId: number) => addBookmark(articleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
    onError: (error) => {
      console.error(error.message);
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
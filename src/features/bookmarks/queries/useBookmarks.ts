import { useQuery, QueryKey } from '@tanstack/react-query';
import { BookmarkType } from '../types/bookmarks.types';

const queryKey: QueryKey = ['bookmarks']

export default function useBookmarks() {
  return useQuery({
    queryKey: queryKey,
    queryFn: getBookmarkedArticles,
    retry: (failureCount, error) => {
      if (error.message === 'Unauthorized') return false;
      return failureCount < 3;
    },
    select: (data) => {
      return data.data.map((bookmark: Omit<BookmarkType, 'bookmarkedAt' | 'createdAt'> & {
        bookmarkedAt: string;
        createdAt: string;
      }) => ({
        ...bookmark,
        bookmarkedAt: new Date(bookmark.bookmarkedAt),
        createdAt: new Date(bookmark.createdAt)
      })) as BookmarkType[];
    }
  })
}

const getBookmarkedArticles = async () => {
  const params = new URLSearchParams({
    limit: '10',
    offset: '0'
  })

  const res = await fetch(`/api/bookmarks?${params.toString()}`);

  if (res.status === 401) {
    throw new Error('Unauthorized');
  }

  if(!res.ok){
    throw new Error('Failed to fetch saved articles');
  }

  return res.json();
}
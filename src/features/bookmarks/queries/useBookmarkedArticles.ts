'use client'

import { useQuery } from '@tanstack/react-query';
import { BookmarkType } from '../types/bookmarks.types';

export default function useBookmarkedArticles() {
  return useQuery({
    queryKey: ['bookmarks'],
    queryFn: getBookmarkedArticles,
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

  if(!res.ok){
    throw new Error('Failed to fetch saved articles');
  }

  return res.json();
}
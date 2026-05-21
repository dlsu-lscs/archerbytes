import { useQuery } from '@tanstack/react-query';
import { FeedArticleType } from '../types/article.types';

export type option = 'newest' | 'oldest' | 'popular';

export default function useArticleList(sort: option = 'newest'){
  return useQuery({
    queryKey: ['articles', {sort}],
    queryFn: () => getArticles(sort),
    select: (data) => {
      return data.data.map((article: any) => ({
        ...article,
        publishedAt: new Date(article.publishedAt),
        createdAt: new Date(article.createdAt),
      })) as FeedArticleType[];
    }
  })
}

const getArticles = async (sort: option) => {
  const params = new URLSearchParams({
    limit: '10',
    status: 'published',
    sort: sort,
  });

  const res = await fetch(`api/articles?${params.toString()}`);
  
  if (!res.ok){
    throw new Error('Failed to fetch articles');
  } 

  return res.json();
}
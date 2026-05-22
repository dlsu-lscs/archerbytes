import { useQuery } from '@tanstack/react-query';
import { FeedArticleType } from '../types/article.types';

export type option = 'newest' | 'oldest' | 'popular';

export interface ArticleQueryParams {
  sort?: option;
  categoryId?: number | null;
}

export default function useArticleList({sort = 'newest', categoryId = null}: ArticleQueryParams){
  return useQuery({
    queryKey: ['articles', {sort, categoryId}],
    queryFn: () => getArticles({sort, categoryId}),
    select: (data) => {
      return data.data.map((article: Omit<FeedArticleType, 'publishedAt' | 'createdAt'> & {
          publishedAt: string;
          createdAt: string;
      }) => ({
        ...article,
        publishedAt: new Date(article.publishedAt),
        createdAt: new Date(article.createdAt),
      })) as FeedArticleType[];
    }
  })
}

const getArticles = async ({sort, categoryId}: ArticleQueryParams) => {
  const params = new URLSearchParams({
    limit: '10',
    status: 'published',
    sort: sort || 'newest',
  });

  if (categoryId !== null && categoryId !== undefined) {
        params.append('category', categoryId.toString());
    }

  const res = await fetch(`api/articles?${params.toString()}`);
  
  if (!res.ok){
    throw new Error('Failed to fetch articles');
  } 

  return res.json();
}
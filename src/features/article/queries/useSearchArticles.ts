import { useQuery } from '@tanstack/react-query';
import type { FeedArticleType } from '../types/article.types';
import type { PaginationMeta } from '@/lib/api/response';

type RawFeedArticle = Omit<FeedArticleType, 'publishedAt' | 'createdAt'> & {
  publishedAt: string;
  createdAt: string;
};

type SearchArticlesResult = {
  data: FeedArticleType[];
  meta: PaginationMeta;
};

interface SearchArticlesParams {
  q: string;
  page?: number;
  limit?: number;
}

async function fetchSearchArticles(
  params: SearchArticlesParams,
): Promise<SearchArticlesResult> {
  const searchParams = new URLSearchParams({ q: params.q });
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));

  const res = await fetch(`/api/articles/search?${searchParams.toString()}`);
  if (!res.ok) throw new Error('Failed to search articles');
  const json: { data: RawFeedArticle[]; meta: PaginationMeta } =
    await res.json();

  return {
    data: json.data.map((article) => ({
      ...article,
      publishedAt: new Date(article.publishedAt),
      createdAt: new Date(article.createdAt),
    })),
    meta: json.meta,
  };
}

interface UseSearchArticlesOptions {
  page?: number;
  limit?: number;
  enabled?: boolean;
}

export default function useSearchArticles(
  q: string,
  options?: UseSearchArticlesOptions,
) {
  return useQuery({
    queryKey: [
      'articles',
      'search',
      { q, page: options?.page, limit: options?.limit },
    ],
    queryFn: () =>
      fetchSearchArticles({ q, page: options?.page, limit: options?.limit }),
    enabled: q.trim().length >= 3 && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000,
  });
}

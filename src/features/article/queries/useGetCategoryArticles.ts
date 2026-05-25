import { useQuery } from '@tanstack/react-query';
import type { FeedArticleType } from '../types/article.types';
import type { PaginationMeta } from '@/lib/api/response';

type RawFeedArticle = Omit<FeedArticleType, 'publishedAt' | 'createdAt'> & {
  publishedAt: string;
  createdAt: string;
};

type CategoryArticlesResult = {
  data: FeedArticleType[];
  meta: PaginationMeta;
};

interface CategoryArticlesParams {
  id: number;
  page?: number;
  limit?: number;
}

async function fetchCategoryArticles(
  params: CategoryArticlesParams,
): Promise<CategoryArticlesResult> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));

  const query = searchParams.toString();
  const res = await fetch(
    `/api/categories/by-id/${params.id}/articles${query ? `?${query}` : ''}`,
  );
  if (!res.ok) throw new Error('Failed to fetch category articles');
  const json: { data: RawFeedArticle[]; meta: PaginationMeta } = await res.json();

  return {
    data: json.data.map((article) => ({
      ...article,
      publishedAt: new Date(article.publishedAt),
      createdAt: new Date(article.createdAt),
    })),
    meta: json.meta,
  };
}

interface UseGetCategoryArticlesOptions {
  page?: number;
  limit?: number;
  enabled?: boolean;
}

export default function useGetCategoryArticles(
  id: number | undefined,
  options?: UseGetCategoryArticlesOptions,
) {
  return useQuery({
    queryKey: ['categories', id, 'articles', { page: options?.page, limit: options?.limit }],
    queryFn: () =>
      fetchCategoryArticles({ id: id!, page: options?.page, limit: options?.limit }),
    enabled: Boolean(id) && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000,
  });
}

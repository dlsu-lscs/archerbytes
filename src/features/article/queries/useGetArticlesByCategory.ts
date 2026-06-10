import { useQuery } from '@tanstack/react-query';
import type { FeedArticleType } from '../types/article.types';
import type { PaginationMeta } from '@/lib/api/response';

type RawFeedArticle = Omit<FeedArticleType, 'publishedAt' | 'createdAt'> & {
  publishedAt: string;
  createdAt: string;
};

type ArticlesByCategoryResult = {
  data: FeedArticleType[];
  meta: PaginationMeta;
};

type SortOption = 'newest' | 'oldest' | 'popular';

interface ArticlesByCategoryParams {
  categoryId: number;
  page?: number;
  limit?: number;
  sort?: SortOption;
}

async function fetchArticlesByCategory(
  params: ArticlesByCategoryParams,
): Promise<ArticlesByCategoryResult> {
  const searchParams = new URLSearchParams({ sort: params.sort ?? 'newest' });
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));

  const res = await fetch(
    `/api/articles/category/${params.categoryId}?${searchParams.toString()}`,
  );
  if (!res.ok) throw new Error('Failed to fetch articles by category');
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

interface UseGetArticlesByCategoryOptions {
  page?: number;
  limit?: number;
  sort?: SortOption;
  enabled?: boolean;
}

export default function useGetArticlesByCategory(
  categoryId: number | undefined,
  options?: UseGetArticlesByCategoryOptions,
) {
  return useQuery({
    queryKey: [
      'articles',
      'by-category',
      categoryId,
      { page: options?.page, limit: options?.limit, sort: options?.sort },
    ],
    queryFn: () =>
      fetchArticlesByCategory({
        categoryId: categoryId!,
        page: options?.page,
        limit: options?.limit,
        sort: options?.sort,
      }),
    enabled: Boolean(categoryId) && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000,
  });
}

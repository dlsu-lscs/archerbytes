import { useQuery } from '@tanstack/react-query';
import type { ArticleDetailsType } from '../types/article.types';

type RawArticleDetails = Omit<ArticleDetailsType, 'publishedAt' | 'createdAt' | 'updatedAt'> & {
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

async function fetchArticleBySlug(slug: string): Promise<ArticleDetailsType> {
  const res = await fetch(`/api/articles/${slug}`);
  if (!res.ok) throw new Error('Failed to fetch article');
  const json: { data: RawArticleDetails } = await res.json();
  const raw = json.data;
  return {
    ...raw,
    publishedAt: raw.publishedAt ? new Date(raw.publishedAt) : null,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  };
}

interface UseGetArticleBySlugOptions {
  enabled?: boolean;
}

export default function useGetArticleBySlug(
  slug: string | undefined,
  options?: UseGetArticleBySlugOptions,
) {
  return useQuery({
    queryKey: ['articles', slug],
    queryFn: () => fetchArticleBySlug(slug!),
    enabled: Boolean(slug) && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000,
  });
}

import { useQuery } from '@tanstack/react-query';
import type { CategoryType } from '../types/article.types';

type RawCategory = Omit<CategoryType, 'createdAt'> & {
  createdAt: string;
};

async function fetchCategoryBySlug(slug: string): Promise<CategoryType> {
  const res = await fetch(`/api/categories/${slug}`);
  if (!res.ok) throw new Error('Failed to fetch category');
  const json: { data: RawCategory } = await res.json();
  return {
    ...json.data,
    createdAt: new Date(json.data.createdAt),
  };
}

interface UseGetCategoryBySlugOptions {
  enabled?: boolean;
}

export default function useGetCategoryBySlug(
  slug: string | undefined,
  options?: UseGetCategoryBySlugOptions,
) {
  return useQuery({
    queryKey: ['categories', slug],
    queryFn: () => fetchCategoryBySlug(slug!),
    enabled: Boolean(slug) && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000,
  });
}

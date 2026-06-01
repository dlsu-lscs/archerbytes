import { describe, expect, test } from 'vitest';
import {
  articleListQuerySchema,
  articleSearchQuerySchema,
  articleSlugParamSchema,
  categoryIdParamSchema,
  idParamSchema,
  paginationQuerySchema,
} from '@/features/article/types';

describe('article query schemas', () => {
  test('applies pagination defaults', () => {
    const parsed = paginationQuerySchema.parse({});
    expect(parsed).toEqual({ page: 1, limit: 10 });
  });

  test('rejects limit greater than 100', () => {
    const result = paginationQuerySchema.safeParse({ page: '1', limit: '101' });
    expect(result.success).toBe(false);
  });

  test('parses list filters correctly', () => {
    const parsed = articleListQuerySchema.parse({
      page: '2',
      limit: '20',
      category: '4',
      status: 'published',
      sort: 'popular',
    });

    expect(parsed).toEqual({
      page: 2,
      limit: 20,
      category: 4,
      status: 'published',
      sort: 'popular',
    });
  });

  test('requires search query length of at least 3', () => {
    const result = articleSearchQuerySchema.safeParse({
      q: 'ab',
      page: '1',
      limit: '10',
    });
    expect(result.success).toBe(false);
  });

  test('parses dynamic route params', () => {
    expect(articleSlugParamSchema.parse({ slug: 'my-article' })).toEqual({
      slug: 'my-article',
    });
    expect(categoryIdParamSchema.parse({ categoryId: '7' })).toEqual({
      categoryId: 7,
    });
    expect(idParamSchema.parse({ id: '9' })).toEqual({ id: 9 });
  });

  test('rejects non-positive ID params', () => {
    expect(categoryIdParamSchema.safeParse({ categoryId: '0' }).success).toBe(
      false,
    );
    expect(idParamSchema.safeParse({ id: '-1' }).success).toBe(false);
  });
});

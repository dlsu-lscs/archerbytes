import { z } from 'zod';

export const articleStatusEnum = z.enum(['published', 'draft']);
export const articleSortEnum = z.enum(['newest', 'oldest', 'popular']);

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const articleListQuerySchema = paginationQuerySchema.extend({
  category: z.coerce.number().int().positive().optional(),
  status: articleStatusEnum.optional(),
  sort: articleSortEnum.default('newest'),
});

export const articleSearchQuerySchema = paginationQuerySchema.extend({
  q: z.string().trim().min(3, 'Search query must be at least 3 characters long'),
});

export const articlesByCategoryQuerySchema = paginationQuerySchema.extend({
  sort: articleSortEnum.default('newest'),
});

export const categoryArticlesQuerySchema = paginationQuerySchema;

export const articleSlugParamSchema = z.object({
  slug: z.string().trim().min(1, 'Article slug is required'),
});

export const categorySlugParamSchema = z.object({
  slug: z.string().trim().min(1, 'Category slug is required'),
});

export const categoryIdParamSchema = z.object({
  categoryId: z.coerce.number().int().positive('Category ID must be a positive integer'),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive('ID must be a positive integer'),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type ArticleListQuery = z.infer<typeof articleListQuerySchema>;
export type ArticleSearchQuery = z.infer<typeof articleSearchQuerySchema>;
export type ArticlesByCategoryQuery = z.infer<
  typeof articlesByCategoryQuerySchema
>;
export type CategoryArticlesQuery = z.infer<typeof categoryArticlesQuerySchema>;
export type ArticleSlugParam = z.infer<typeof articleSlugParamSchema>;
export type CategorySlugParam = z.infer<typeof categorySlugParamSchema>;
export type CategoryIdParam = z.infer<typeof categoryIdParamSchema>;
export type IdParam = z.infer<typeof idParamSchema>;

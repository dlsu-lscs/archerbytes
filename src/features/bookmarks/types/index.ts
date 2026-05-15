import { z } from 'zod';
import { bookmarks } from '@/lib/db/schema';

export const createBookmarkSchema = z.object({
  articleId: z.coerce
    .number()
    .int('Article ID must be a whole number')
    .positive('Article ID must be a positive integer'),
});

export const removeBookmarkSchema = z.object({
  articleId: z.coerce
    .number()
    .int('Article ID must be a whole number')
    .positive('Article ID must be a positive integer'),
});

export const paginationQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int('Limit must be a whole number')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit must not exceed 100')
    .default(10),
  offset: z.coerce
    .number()
    .int('Offset must be a whole number')
    .min(0, 'Offset cannot be negative')
    .default(0),
});

export const bookmarkResponseSchema = z.object({
  id: z.number().int(),
  userId: z.string().min(1),
  articleId: z.number().int(),
  bookmarkedAt: z.date(),
  createdAt: z.date(),
});

export const bookmarkArticleSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  subtitle: z.string(),
  slug: z.string(),
  featuredImageUrl: z.string().nullable(),
  status: z.string(),
  publishedAt: z.date().nullable(),
  createdAt: z.date(),
});

export const bookmarkWithArticleSchema = bookmarkResponseSchema.extend({
  article: bookmarkArticleSchema,
});

export const bookmarkListResponseSchema = z.object({
  items: z.array(bookmarkWithArticleSchema),
  total: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  offset: z.number().int().nonnegative(),
});

export type CreateBookmarkInput = z.infer<typeof createBookmarkSchema>;
export type RemoveBookmarkInput = z.infer<typeof removeBookmarkSchema>;
export type BookmarkPaginationQuery = z.infer<typeof paginationQuerySchema>;
export type BookmarkResponse = z.infer<typeof bookmarkResponseSchema>;
export type BookmarkArticle = z.infer<typeof bookmarkArticleSchema>;
export type BookmarkWithArticle = z.infer<typeof bookmarkWithArticleSchema>;
export type BookmarkListResponse = z.infer<typeof bookmarkListResponseSchema>;
export type BookmarkRow = typeof bookmarks.$inferSelect;
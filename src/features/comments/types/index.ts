import { z } from 'zod';

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

export const createCommentSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  articleId: z.number().int().positive('Article ID is required'),
  content: z
    .string()
    .min(1, 'Content is Required')
    .max(5000, 'Content is too long'),
  replyTo: z.number().int().positive().nullable().optional(),
});

export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Content is Required')
    .max(5000, 'Content is too long'),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type CommentPaginationQuery = z.infer<typeof paginationQuerySchema>;

export * from './comment.types';

import { z } from 'zod';

export const createCommentSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  articleId: z.string().min(1, 'Article ID is required'),
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

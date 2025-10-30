import { z } from 'zod';

export const reactionTypes = [
  'like',
  'heart',
  'care',
  'haha',
  'wow',
  'sad',
  'angry',
] as const;
export const reactionTypeEnum = z.enum(reactionTypes);

export const createArticleReactionSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  articleId: z.string().min(1, 'Article ID is required'),
  reactionType: reactionTypeEnum,
});

export const deleteArticleReactionSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  articleId: z.string().min(1, 'Article ID is required'),
});

export const updateArticleReactionSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  articleId: z.string().min(1, 'Article ID is required'),
  reactionType: reactionTypeEnum,
});

export const createCommentReactionSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  commentId: z.number().int().positive('Comment ID must be a positive integer'),
  reactionType: reactionTypeEnum,
});

export const deleteCommentReactionSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  commentId: z.number().int().positive('Comment ID must be a positive integer'),
});

export const updateCommentReactionSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  commentId: z.number().int().positive('Comment ID must be a positive integer'),
  reactionType: reactionTypeEnum,
});

export type ReactionType = z.infer<typeof reactionTypeEnum>;
export type CreateArticleReactionInput = z.infer<
  typeof createArticleReactionSchema
>;
export type DeleteArticleReactionInput = z.infer<
  typeof deleteArticleReactionSchema
>;
export type UpdateArticleReactionInput = z.infer<
  typeof updateArticleReactionSchema
>;
export type CreateCommentReactionInput = z.infer<
  typeof createCommentReactionSchema
>;
export type DeleteCommentReactionInput = z.infer<
  typeof deleteCommentReactionSchema
>;
export type UpdateCommentReactionInput = z.infer<
  typeof updateCommentReactionSchema
>;

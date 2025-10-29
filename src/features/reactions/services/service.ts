import { db } from '@/config/database';
import { articleReactions, commentReactions } from '@/lib/db/reactions.entity';
import { eq, and } from 'drizzle-orm';
import type {
  CreateArticleReactionInput,
  DeleteArticleReactionInput,
  CreateCommentReactionInput,
  DeleteCommentReactionInput,
} from '../types';

export async function createArticleReaction(data: CreateArticleReactionInput) {
  const inserted = await db
    .insert(articleReactions)
    .values({
      userId: data.userId,
      articleId: data.articleId,
      reactionType: data.reactionType,
    })
    .returning();
  return inserted[0];
}

export async function getArticleReactions(articleId: string) {
  return db
    .select()
    .from(articleReactions)
    .where(eq(articleReactions.articleId, articleId))
    .orderBy(articleReactions.createdAt);
}

export async function deleteArticleReaction(data: DeleteArticleReactionInput) {
  const deleted = await db
    .delete(articleReactions)
    .where(
      and(
        eq(articleReactions.userId, data.userId),
        eq(articleReactions.articleId, data.articleId),
      ),
    )
    .returning();
  return deleted.length > 0 ? deleted[0] : null;
}

export async function createCommentReaction(data: CreateCommentReactionInput) {
  const inserted = await db
    .insert(commentReactions)
    .values({
      userId: data.userId,
      commentId: data.commentId,
      reactionType: data.reactionType,
    })
    .returning();
  return inserted[0];
}

export async function getCommentReactions(commentId: number) {
  return db
    .select()
    .from(commentReactions)
    .where(eq(commentReactions.commentId, commentId))
    .orderBy(commentReactions.createdAt);
}

export async function deleteCommentReaction(data: DeleteCommentReactionInput) {
  const deleted = await db
    .delete(commentReactions)
    .where(
      and(
        eq(commentReactions.userId, data.userId),
        eq(commentReactions.commentId, data.commentId),
      ),
    )
    .returning();
  return deleted.length > 0 ? deleted[0] : null;
}

export const ReactionService = {
  createArticleReaction,
  getArticleReactions,
  deleteArticleReaction,
  createCommentReaction,
  getCommentReactions,
  deleteCommentReaction,
};

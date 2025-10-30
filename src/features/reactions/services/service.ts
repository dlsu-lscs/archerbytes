import { db } from '@/config/database';
import { articleReactions, commentReactions } from '@/lib/db/reactions.entity';
import { eq, and, sql } from 'drizzle-orm';
import type {
  CreateArticleReactionInput,
  DeleteArticleReactionInput,
  CreateCommentReactionInput,
  DeleteCommentReactionInput,
  UpdateArticleReactionInput,
  UpdateCommentReactionInput,
} from '../types';

export async function createArticleReaction(data: CreateArticleReactionInput) {
  try {
    const inserted = await db
      .insert(articleReactions)
      .values({
        userId: data.userId,
        articleId: data.articleId,
        reactionType: data.reactionType,
      })
      .returning();
    return inserted.length > 0 ? inserted[0] : null;
  } catch (error) {
    console.error('Error creating article reaction:', error);
    throw error;
  }
}

export async function getReactionsByArticleIdAndUserId(
  articleId: string,
  userId: string,
) {
  try {
    return await db
      .select()
      .from(articleReactions)
      .where(
        and(
          eq(articleReactions.articleId, articleId),
          eq(articleReactions.userId, userId),
        ),
      )
      .orderBy(articleReactions.createdAt);
  } catch (error) {
    console.error('Error fetching reactions by article and user:', error);
    throw error;
  }
}

export async function getTotalReactionsByArticleId(articleId: string) {
  try {
    return await db
      .select({
        reactionType: articleReactions.reactionType,
        count: sql<number>`cast(count(*) as integer)`,
      })
      .from(articleReactions)
      .where(eq(articleReactions.articleId, articleId))
      .groupBy(articleReactions.reactionType);
  } catch (error) {
    console.error('Error fetching total reactions for article:', error);
    throw error;
  }
}

export async function updateArticleReaction(data: UpdateArticleReactionInput) {
  try {
    const updated = await db
      .update(articleReactions)
      .set({ reactionType: data.reactionType })
      .where(
        and(
          eq(articleReactions.userId, data.userId),
          eq(articleReactions.articleId, data.articleId),
        ),
      )
      .returning();
    return updated.length > 0 ? updated[0] : null;
  } catch (error) {
    console.error('Error updating article reaction:', error);
    throw error;
  }
}

export async function deleteArticleReaction(data: DeleteArticleReactionInput) {
  try {
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
  } catch (error) {
    console.error('Error deleting article reaction:', error);
    throw error;
  }
}

export async function createCommentReaction(data: CreateCommentReactionInput) {
  try {
    const inserted = await db
      .insert(commentReactions)
      .values({
        userId: data.userId,
        commentId: data.commentId,
        reactionType: data.reactionType,
      })
      .returning();
    return inserted.length > 0 ? inserted[0] : null;
  } catch (error) {
    console.error('Error creating comment reaction:', error);
    throw error;
  }
}

export async function getReactionsByCommentIdAndUserId(
  commentId: number,
  userId: string,
) {
  try {
    return await db
      .select()
      .from(commentReactions)
      .where(
        and(
          eq(commentReactions.commentId, commentId),
          eq(commentReactions.userId, userId),
        ),
      )
      .orderBy(commentReactions.createdAt);
  } catch (error) {
    console.error('Error fetching reactions by comment and user:', error);
    throw error;
  }
}

export async function getTotalReactionsByCommentId(commentId: number) {
  try {
    return await db
      .select({
        reactionType: commentReactions.reactionType,
        count: sql<number>`cast(count(*) as integer)`,
      })
      .from(commentReactions)
      .where(eq(commentReactions.commentId, commentId))
      .groupBy(commentReactions.reactionType);
  } catch (error) {
    console.error('Error fetching total reactions for comment:', error);
    throw error;
  }
}

export async function updateCommentReaction(data: UpdateCommentReactionInput) {
  try {
    const updated = await db
      .update(commentReactions)
      .set({ reactionType: data.reactionType })
      .where(
        and(
          eq(commentReactions.userId, data.userId),
          eq(commentReactions.commentId, data.commentId),
        ),
      )
      .returning();
    return updated.length > 0 ? updated[0] : null;
  } catch (error) {
    console.error('Error updating comment reaction:', error);
    throw error;
  }
}

export async function deleteCommentReaction(data: DeleteCommentReactionInput) {
  try {
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
  } catch (error) {
    console.error('Error deleting comment reaction:', error);
    throw error;
  }
}

export const ReactionService = {
  createArticleReaction,
  getReactionsByArticleIdAndUserId,
  getTotalReactionsByArticleId,
  updateArticleReaction,
  deleteArticleReaction,
  createCommentReaction,
  getReactionsByCommentIdAndUserId,
  getTotalReactionsByCommentId,
  updateCommentReaction,
  deleteCommentReaction,
};

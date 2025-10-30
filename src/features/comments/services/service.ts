import { db } from '@/config/database';
import { comments } from '@/lib/db/schema';
import { eq, sql, and } from 'drizzle-orm';
import type { CreateCommentInput, UpdateCommentInput } from '../types';

export async function createComment(data: CreateCommentInput) {
  try {
    if (data.replyTo) {
      const parent = await db
        .select()
        .from(comments)
        .where(eq(comments.id, data.replyTo));

      if (!parent[0]) {
        throw new Error('Parent comment does not exist.');
      }

      if (parent[0].replyTo !== null) {
        throw new Error('Can only reply to parent comments.');
      }
    }

    const inserted = await db
      .insert(comments)
      .values({
        userId: data.userId,
        articleId: data.articleId,
        content: data.content.trim(),
        replyTo: data.replyTo ?? null,
      })
      .returning();
    return inserted.length > 0 ? inserted[0] : null;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
}

export async function getCommentsByArticleID(articleId: string) {
  try {
    return db
      .select()
      .from(comments)
      .where(eq(comments.articleId, articleId))
      .orderBy(comments.createdAt);
  } catch (error) {
    console.error('Error fetching comments by article ID:', error);
    throw error;
  }
}

export async function getCommentById(id: number) {
  try {
    const rows = await db.select().from(comments).where(eq(comments.id, id));
    return rows[0] ?? null;
  } catch (error) {
    console.error('Error fetching comment by ID:', error);
    throw error;
  }
}

export async function getReplies(parentId: number) {
  try {
    return db
      .select()
      .from(comments)
      .where(eq(comments.replyTo, parentId))
      .orderBy(comments.createdAt);
  } catch (error) {
    console.error('Error fetching replies:', error);
    throw error;
  }
}

export async function updateComment(
  id: number,
  userId: string,
  data: UpdateCommentInput,
) {
  try {
    const updated = await db
      .update(comments)
      .set({
        ...(data.content !== undefined ? { content: data.content.trim() } : {}),
        updatedAt: sql`now()`,
      })
      .where(and(eq(comments.id, id), eq(comments.userId, userId)))
      .returning();

    return updated.length > 0 ? updated[0] : null;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
}

export async function deleteComment(id: number, userId: string) {
  try {
    const deleted = await db
      .delete(comments)
      .where(and(eq(comments.id, id), eq(comments.userId, userId)))
      .returning();
    return deleted.length > 0 ? deleted[0] : null;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}

export const CommentService = {
  create: createComment,
  getByArticleID: getCommentsByArticleID,
  getById: getCommentById,
  update: updateComment,
  delete: deleteComment,
  getReplies,
};

import { db } from '@/config/database';
import { comments } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import type { CreateCommentInput, UpdateCommentInput } from '../types';

export async function createComment(data: CreateCommentInput) {
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
  return inserted[0];
}

export async function getCommentsByArticleID(articleId: string) {
  return db
    .select()
    .from(comments)
    .where(eq(comments.articleId, articleId))
    .orderBy(comments.createdAt);
}

export async function getCommentById(id: number) {
  const rows = await db.select().from(comments).where(eq(comments.id, id));
  return rows[0] ?? null;
}

export async function getReplies(parentId: number) {
  return db
    .select()
    .from(comments)
    .where(eq(comments.replyTo, parentId))
    .orderBy(comments.createdAt);
}

export async function updateComment(id: number, data: UpdateCommentInput) {
  const updated = await db
    .update(comments)
    .set({
      ...(data.content !== undefined ? { content: data.content.trim() } : {}),
      updatedAt: sql`now()`,
    })
    .where(eq(comments.id, id))
    .returning();

  return updated.length > 0 ? updated[0] : null;
}

export async function deleteComment(id: number) {
  const deleted = await db
    .delete(comments)
    .where(eq(comments.id, id))
    .returning();
  return deleted.length > 0 ? deleted[0] : null;
}

export const CommentService = {
  create: createComment,
  getByArticleID: getCommentsByArticleID,
  getById: getCommentById,
  update: updateComment,
  delete: deleteComment,
  getReplies,
};

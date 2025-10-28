import { db } from '@/config/database';
import { comments } from '@/lib/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import type { CreateCommentInput, UpdateCommentInput } from '../types';

export class CommentService {
  static async create(data: CreateCommentInput) {
    const [comment] = await db
      .insert(comments)
      .values({
        userId: data.userId,
        articleId: data.articleId,
        content: data.content,
        replyTo: data.replyTo,
      })
      .returning();
    return comment;
  }

  static async getByArticleID(articleID: string) {
    return await db
      .select()
      .from(comments)
      .where(and(eq(comments.articleId, articleID), isNull(comments.replyTo)));
  }

  static async getById(id: number) {
    const [comment] = await db
      .select()
      .from(comments)
      .where(eq(comments.id, id));
    return comment ?? null;
  }

  static async getReplies(parentCommentId: number) {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.replyTo, parentCommentId));
  }

  static async update(id: number, data: UpdateCommentInput) {
    const [updated] = await db
      .update(comments)
      .set({
        content: data.content,
        updatedAt: new Date(),
      })
      .where(eq(comments.id, id))
      .returning();
    return updated ?? null;
  }

  static async delete(id: number) {
    const [deleted] = await db
      .delete(comments)
      .where(eq(comments.id, id))
      .returning();

    return deleted ?? null;
  }
}

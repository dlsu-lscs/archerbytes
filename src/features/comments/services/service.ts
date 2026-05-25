import { db } from '@/config/database';
import { comments, user, commentReactions } from '@/lib/db/schema';
import { and, count, desc, eq, sql } from 'drizzle-orm';
import type {
  CommentPaginationQuery,
  CreateCommentInput,
  UpdateCommentInput,
} from '../types';

type CommentRow = {
  id: number;
  userId: string;
  articleId: number;
  replyTo: number | null;
  content: string;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
};

async function buildCommentResponse(commentRow: CommentRow) {
  const reactionCountSelect = sql<number>`(select count(distinct ${commentReactions.id})::int from ${commentReactions} where ${commentReactions.commentId} = ${comments.id})`;
  const replyCountSelect = sql<number>`(select count(*)::int from ${comments} c where c.reply_to = ${comments.id})`;

  const rows = await db
    .select({
      id: comments.id,
      articleId: comments.articleId,
      content: comments.content,
      replyTo: comments.replyTo,
      isEdited: comments.isEdited,
      createdAt: comments.createdAt,
      updatedAt: comments.updatedAt,
      reactionCount: reactionCountSelect,
      replyCount: replyCountSelect,
      user: {
        id: user.id,
        name: user.name,
        avatarURL: user.image,
        occupation: user.occupation,
      },
    })
    .from(comments)
    .innerJoin(user, eq(comments.userId, user.id))
    .where(eq(comments.id, commentRow.id))
    .limit(1);

  if (rows[0]) {
    return rows[0];
  }

  const [userRow] = await db
    .select({
      id: user.id,
      name: user.name,
      avatarURL: user.image,
      occupation: user.occupation,
    })
    .from(user)
    .where(eq(user.id, commentRow.userId))
    .limit(1);

  return {
    id: commentRow.id,
    articleId: commentRow.articleId,
    content: commentRow.content,
    replyTo: commentRow.replyTo,
    isEdited: commentRow.isEdited,
    createdAt: commentRow.createdAt,
    updatedAt: commentRow.updatedAt,
    reactionCount: 0,
    replyCount: 0,
    user: userRow ?? {
      id: commentRow.userId,
      name: '',
      avatarURL: null,
      occupation: null,
    },
  };
}

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

    if (inserted.length === 0) return null;
    const id = inserted[0].id as number;
    return await getCommentById(id);
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
}

function buildCommentSelect() {
  const reactionCountSelect = sql<number>`(select count(distinct ${commentReactions.id})::int from ${commentReactions} where ${commentReactions.commentId} = ${comments.id})`;
  const replyCountSelect = sql<number>`(select count(*)::int from ${comments} c where c.reply_to = ${comments.id})`;

  return {
    id: comments.id,
    articleId: comments.articleId,
    content: comments.content,
    replyTo: comments.replyTo,
    isEdited: comments.isEdited,
    createdAt: comments.createdAt,
    updatedAt: comments.updatedAt,
    reactionCount: reactionCountSelect,
    replyCount: replyCountSelect,
    user: {
      id: user.id,
      name: user.name,
      avatarURL: user.image,
      occupation: user.occupation,
    },
  };
}

function getCommentBaseFilters(articleId: number) {
  return and(
    eq(comments.articleId, articleId),
    sql`${comments.replyTo} IS NULL`,
  );
}

export async function getCommentsByArticleID(
  articleId: number,
  query: CommentPaginationQuery,
) {
  try {
    const [{ total }] = await db
      .select({ total: count(comments.id) })
      .from(comments)
      .where(getCommentBaseFilters(articleId));

    const items = await db
      .select(buildCommentSelect())
      .from(comments)
      .innerJoin(user, eq(comments.userId, user.id))
      .where(getCommentBaseFilters(articleId))
      .orderBy(desc(comments.createdAt), desc(comments.id))
      .limit(query.limit)
      .offset(query.offset);

    return {
      items,
      total,
      limit: query.limit,
      offset: query.offset,
    };
  } catch (error) {
    console.error('Error fetching comments by article ID:', error);
    throw error;
  }
}

export async function getCommentById(id: number) {
  try {
    const reactionCountSelect = sql<number>`(select count(distinct ${commentReactions.id})::int from ${commentReactions} where ${commentReactions.commentId} = ${comments.id})`;
    const replyCountSelect = sql<number>`(select count(*)::int from ${comments} c where c.reply_to = ${comments.id})`;

    const rows = await db
      .select({
        id: comments.id,
        articleId: comments.articleId,
        content: comments.content,
        replyTo: comments.replyTo,
        isEdited: comments.isEdited,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
        reactionCount: reactionCountSelect,
        replyCount: replyCountSelect,
        user: {
          id: user.id,
          name: user.name,
          avatarURL: user.image,
          occupation: user.occupation,
        },
      })
      .from(comments)
      .innerJoin(user, eq(comments.userId, user.id))
      .where(eq(comments.id, id))
      .limit(1);

    return rows[0] ?? null;
  } catch (error) {
    console.error('Error fetching comment by ID:', error);
    throw error;
  }
}

export async function getReplies(
  parentId: number,
  query: CommentPaginationQuery,
) {
  try {
    const [{ total }] = await db
      .select({ total: count(comments.id) })
      .from(comments)
      .where(eq(comments.replyTo, parentId));

    const items = await db
      .select(buildCommentSelect())
      .from(comments)
      .innerJoin(user, eq(comments.userId, user.id))
      .where(eq(comments.replyTo, parentId))
      .orderBy(desc(comments.createdAt), desc(comments.id))
      .limit(query.limit)
      .offset(query.offset);

    return {
      items,
      total,
      limit: query.limit,
      offset: query.offset,
    };
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
        isEdited: true,
        updatedAt: sql`now()`,
      })
      .where(and(eq(comments.id, id), eq(comments.userId, userId)))
      .returning();

    if (updated.length === 0) return null;
    return (
      (await getCommentById(id)) ??
      (await buildCommentResponse(updated[0] as CommentRow))
    );
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
}

export async function deleteComment(id: number, userId: string) {
  try {
    const existing = await getCommentById(id);
    if (!existing) return null;

    const deleted = await db
      .delete(comments)
      .where(and(eq(comments.id, id), eq(comments.userId, userId)))
      .returning();

    return deleted.length > 0 ? existing : null;
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

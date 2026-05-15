import { db } from '@/config/database';
import { articles, bookmarks } from '@/lib/db/schema';
import { and, count, desc, eq, inArray, sql } from 'drizzle-orm';

export async function getBookmarkByUserAndArticle(
  userId: string,
  articleId: number,
) {
  try {
    const rows = await db
      .select()
      .from(bookmarks)
      .where(
        and(eq(bookmarks.userId, userId), eq(bookmarks.articleId, articleId)),
      )
      .limit(1);

    return rows[0] ?? null;
  } catch (error) {
    console.error('Error fetching bookmark by user and article:', error);
    throw error;
  }
}

export async function createBookmark(userId: string, articleId: number) {
  try {
    const existing = await getBookmarkByUserAndArticle(userId, articleId);
    if (existing) {
      throw new Error('Bookmark already exists');
    }

    const inserted = await db
      .insert(bookmarks)
      .values({
        userId,
        articleId,
        bookmarkedAt: sql`now()`,
      })
      .returning();

    return inserted[0] ?? null;
  } catch (error) {
    console.error('Error creating bookmark:', error);
    throw error;
  }
}

export async function removeBookmark(userId: string, articleId: number) {
  try {
    const deleted = await db
      .delete(bookmarks)
      .where(
        and(eq(bookmarks.userId, userId), eq(bookmarks.articleId, articleId)),
      )
      .returning();

    return deleted[0] ?? null;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw error;
  }
}

export async function getBookmarksByUserId(
  userId: string,
  limit: number,
  offset: number,
) {
  try {
    const [{ total }] = await db
      .select({ total: count(bookmarks.id) })
      .from(bookmarks)
      .where(eq(bookmarks.userId, userId));

    const items = await db
      .select({
        id: bookmarks.id,
        userId: bookmarks.userId,
        articleId: bookmarks.articleId,
        bookmarkedAt: bookmarks.bookmarkedAt,
        createdAt: bookmarks.createdAt,
        article: {
          id: articles.id,
          title: articles.title,
          subtitle: articles.subtitle,
          slug: articles.slug,
          featuredImageUrl: articles.featuredImageUrl,
          status: articles.status,
          publishedAt: articles.publishedAt,
          createdAt: articles.createdAt,
        },
      })
      .from(bookmarks)
      .innerJoin(articles, eq(bookmarks.articleId, articles.id))
      .where(eq(bookmarks.userId, userId))
      .orderBy(desc(bookmarks.bookmarkedAt), desc(bookmarks.id))
      .limit(limit)
      .offset(offset);

    return {
      items,
      total,
      limit,
      offset,
    };
  } catch (error) {
    console.error('Error listing bookmarks by user:', error);
    throw error;
  }
}

export async function getBookmarkStatusByUserId(
  userId: string,
  articleIds: number[],
) {
  try {
    if (articleIds.length === 0) {
      return [];
    }

    return await db
      .select({
        articleId: bookmarks.articleId,
        bookmarkedAt: bookmarks.bookmarkedAt,
      })
      .from(bookmarks)
      .where(
        and(
          eq(bookmarks.userId, userId),
          inArray(bookmarks.articleId, articleIds),
        ),
      );
  } catch (error) {
    console.error('Error fetching bookmark status by user:', error);
    throw error;
  }
}

export const BookmarkService = {
  getByUserAndArticle: getBookmarkByUserAndArticle,
  create: createBookmark,
  remove: removeBookmark,
  listByUserId: getBookmarksByUserId,
  getStatusByUserId: getBookmarkStatusByUserId,
};

import { db } from '@/config/database';
import {
  articles,
  bookmarks,
  user,
  articleCategories,
  articleReactions,
  comments,
} from '@/lib/db/schema';
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

    const reactionCountSelect = sql<number>`count(distinct ${articleReactions.id})::int`;
    const commentCountSelect = sql<number>`count(distinct ${comments.id})::int`;

    const items = await db
      .select({
        id: bookmarks.id,
        userId: bookmarks.userId,
        articleId: bookmarks.articleId,
        bookmarkedAt: bookmarks.bookmarkedAt,
        createdAt: bookmarks.createdAt,
        articleId_: articles.id,
        articleTitle: articles.title,
        articleSubtitle: articles.subtitle,
        articleSlug: articles.slug,
        articleFeaturedImageUrl: articles.featuredImageUrl,
        articleStatus: articles.status,
        articleIsEdited: articles.isEdited,
        articlePublishedAt: articles.publishedAt,
        articleCreatedAt: articles.createdAt,
        userId_: user.id,
        userName: user.name,
        userAvatarURL: user.image,
        userOccupation: user.occupation,
        categoryId_: articleCategories.id,
        categoryName: articleCategories.name,
        categorySlug: articleCategories.slug,
        reactionCount: reactionCountSelect,
        commentCount: commentCountSelect,
      })
      .from(bookmarks)
      .innerJoin(articles, eq(bookmarks.articleId, articles.id))
      .innerJoin(user, eq(articles.userId, user.id))
      .innerJoin(
        articleCategories,
        eq(articles.categoryId, articleCategories.id),
      )
      .leftJoin(articleReactions, eq(articleReactions.articleId, articles.id))
      .leftJoin(comments, eq(comments.articleId, articles.id))
      .where(eq(bookmarks.userId, userId))
      .groupBy(
        bookmarks.id,
        bookmarks.userId,
        bookmarks.articleId,
        bookmarks.bookmarkedAt,
        bookmarks.createdAt,
        articles.id,
        articles.title,
        articles.subtitle,
        articles.slug,
        articles.featuredImageUrl,
        articles.status,
        articles.isEdited,
        articles.publishedAt,
        articles.createdAt,
        user.id,
        user.name,
        user.image,
        user.occupation,
        articleCategories.id,
        articleCategories.name,
        articleCategories.slug,
      )
      .orderBy(desc(bookmarks.bookmarkedAt), desc(bookmarks.id))
      .limit(limit)
      .offset(offset);

    const transformedItems = items.map((item) => ({
      id: item.id,
      userId: item.userId,
      articleId: item.articleId,
      bookmarkedAt: item.bookmarkedAt,
      createdAt: item.createdAt,
      article: {
        id: item.articleId_,
        title: item.articleTitle,
        subtitle: item.articleSubtitle,
        slug: item.articleSlug,
        featuredImageUrl: item.articleFeaturedImageUrl,
        status: item.articleStatus,
        isEdited: item.articleIsEdited,
        publishedAt: item.articlePublishedAt,
        createdAt: item.articleCreatedAt,
        author: {
          id: item.userId_,
          name: item.userName,
          avatarURL: item.userAvatarURL,
          occupation: item.userOccupation,
        },
        category: {
          id: item.categoryId_,
          name: item.categoryName,
          slug: item.categorySlug,
        },
        reactionCount: item.reactionCount,
        commentCount: item.commentCount,
      },
    }));

    return {
      items: transformedItems,
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

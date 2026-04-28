import { db } from '@/config/database';
import { articleCategories, articleReactions, articles, comments, user } from '@/lib/db/schema';
import type { ArticleDetailsType } from '@/features/article/types/article.types';
import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  or,
  type SQL,
  sql,
} from 'drizzle-orm';
import type {
  ArticleListQuery,
  ArticleSearchQuery,
  ArticlesByCategoryQuery,
  CategoryArticlesQuery,
} from '../types';

const DEFAULT_VISIBLE_STATUS = 'published' as const;

type SortOption = 'newest' | 'oldest' | 'popular';

type ListArticlePayload = Partial<
  Omit<
    ArticleDetailsType,
    | 'quote'
    | 'quotee'
    | 'avatarURL'
    | 'occupation'
    | 'keywords'
    | 'previewURL'
    | 'readingTime'
    | 'publicationDate'
  >
> &
  Pick<ArticleDetailsType, 'title' | 'author' | 'commentCount' | 'likeCount'> & {
    publicationDate: Date | null;
  };

type ListArticleRow = ListArticlePayload & {
  id: number;
  subtitle: string;
  slug: string;
  featuredImageUrl: string | null;
  status: string;
  publishedAt: Date | null;
  createdAt: Date;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  reactionCount: number;
};

function buildArticleWhereClause(options: {
  status?: 'published' | 'draft';
  categoryId?: number;
  searchQuery?: string;
}) {
  const conditions: SQL[] = [];

  conditions.push(
    eq(articles.status, options.status ?? DEFAULT_VISIBLE_STATUS),
  );

  if (options.categoryId !== undefined) {
    conditions.push(eq(articles.categoryId, options.categoryId));
  }

  if (options.searchQuery) {
    const searchTerm = `%${options.searchQuery}%`;
    conditions.push(
      or(
        ilike(articles.title, searchTerm),
        ilike(articles.subtitle, searchTerm),
        ilike(articles.content, searchTerm),
      )!,
    );
  }

  return conditions.length === 1 ? conditions[0] : and(...conditions)!;
}

function applySort(sort: SortOption) {
  if (sort === 'oldest') {
    return [asc(articles.publishedAt), asc(articles.createdAt)] as const;
  }

  return [desc(articles.publishedAt), desc(articles.createdAt)] as const;
}

async function listArticlesWithCount(options: {
  page: number;
  limit: number;
  sort: SortOption;
  status?: 'published' | 'draft';
  categoryId?: number;
  searchQuery?: string;
}) {
  const offset = (options.page - 1) * options.limit;
  const whereClause = buildArticleWhereClause({
    status: options.status,
    categoryId: options.categoryId,
    searchQuery: options.searchQuery,
  });

  const [{ total }] = await db
    .select({ total: count(articles.id) })
    .from(articles)
    .where(whereClause);

  let rows: ListArticleRow[] = [];
  const likeCountSelect = sql<number>`count(distinct ${articleReactions.id})::int`;
  const commentCountSelect = sql<number>`count(distinct ${comments.id})::int`;

  if (options.sort === 'popular') {
    rows = await db
      .select({
        id: articles.id,
        title: articles.title,
        author: user.name,
        subtitle: articles.subtitle,
        slug: articles.slug,
        featuredImageUrl: articles.featuredImageUrl,
        status: articles.status,
        publicationDate: articles.publishedAt,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        category: {
          id: articleCategories.id,
          name: articleCategories.name,
          slug: articleCategories.slug,
        },
        likeCount: likeCountSelect,
        commentCount: commentCountSelect,
        reactionCount: likeCountSelect,
      })
      .from(articles)
      .innerJoin(
        articleCategories,
        eq(articles.categoryId, articleCategories.id),
      )
      .innerJoin(user, eq(articles.userId, user.id))
      .leftJoin(
        articleReactions,
        sql`${articleReactions.articleId} = ${articles.id}::text`,
      )
      .leftJoin(comments, sql`${comments.articleId} = ${articles.id}::text`)
      .where(whereClause)
      .groupBy(articles.id, articleCategories.id, user.id)
      .orderBy(
        desc(sql`count(distinct ${articleReactions.id})`),
        desc(articles.publishedAt),
        desc(articles.createdAt),
      )
      .limit(options.limit)
      .offset(offset);
  } else {
    rows = await db
      .select({
        id: articles.id,
        title: articles.title,
        author: user.name,
        subtitle: articles.subtitle,
        slug: articles.slug,
        featuredImageUrl: articles.featuredImageUrl,
        status: articles.status,
        publicationDate: articles.publishedAt,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        category: {
          id: articleCategories.id,
          name: articleCategories.name,
          slug: articleCategories.slug,
        },
        likeCount: likeCountSelect,
        commentCount: commentCountSelect,
        reactionCount: likeCountSelect,
      })
      .from(articles)
      .innerJoin(
        articleCategories,
        eq(articles.categoryId, articleCategories.id),
      )
      .innerJoin(user, eq(articles.userId, user.id))
      .leftJoin(
        articleReactions,
        sql`${articleReactions.articleId} = ${articles.id}::text`,
      )
      .leftJoin(comments, sql`${comments.articleId} = ${articles.id}::text`)
      .where(whereClause)
      .groupBy(articles.id, articleCategories.id, user.id)
      .orderBy(...applySort(options.sort))
      .limit(options.limit)
      .offset(offset);
  }

  return {
    items: rows,
    total,
    page: options.page,
    limit: options.limit,
  };
}

export async function getArticleBySlug(
  slug: string,
  status?: 'published' | 'draft',
) {
  try {
    const article =
      (await db.query.articles.findFirst({
        where: and(
          eq(articles.slug, slug),
          eq(articles.status, status ?? DEFAULT_VISIBLE_STATUS),
        ),
        with: {
          category: true,
          user: {
            columns: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      })) ?? null;

    if (!article) {
      return null;
    }

    const rows = await db
      .select({
        likeCount: sql<number>`count(distinct ${articleReactions.id})::int`,
        commentCount: sql<number>`count(distinct ${comments.id})::int`,
      })
      .from(articles)
      .leftJoin(
        articleReactions,
        sql`${articleReactions.articleId} = ${articles.id}::text`,
      )
      .leftJoin(comments, sql`${comments.articleId} = ${articles.id}::text`)
      .where(eq(articles.id, article.id))
      .groupBy(articles.id)
      .limit(1);

    const counts = rows[0] ?? { likeCount: 0, commentCount: 0 };

    return {
      ...article,
      author: article.user.name,
      likeCount: counts.likeCount,
      commentCount: counts.commentCount,
    };
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    throw error;
  }
}

export async function listArticles(query: ArticleListQuery) {
  try {
    return listArticlesWithCount({
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      status: query.status,
      categoryId: query.category,
    });
  } catch (error) {
    console.error('Error listing articles:', error);
    throw error;
  }
}

export async function searchArticles(query: ArticleSearchQuery) {
  try {
    return listArticlesWithCount({
      page: query.page,
      limit: query.limit,
      sort: 'newest',
      searchQuery: query.q,
    });
  } catch (error) {
    console.error('Error searching articles:', error);
    throw error;
  }
}

export async function listArticlesByCategoryId(
  categoryId: number,
  query: ArticlesByCategoryQuery,
) {
  try {
    return listArticlesWithCount({
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      categoryId,
    });
  } catch (error) {
    console.error('Error listing articles by category ID:', error);
    throw error;
  }
}

export async function listCategoriesWithArticleCount() {
  try {
    return await db
      .select({
        id: articleCategories.id,
        name: articleCategories.name,
        slug: articleCategories.slug,
        description: articleCategories.description,
        createdAt: articleCategories.createdAt,
        updatedAt: articleCategories.updatedAt,
        articleCount: sql<number>`count(${articles.id})::int`,
      })
      .from(articleCategories)
      .leftJoin(
        articles,
        and(
          eq(articles.categoryId, articleCategories.id),
          eq(articles.status, DEFAULT_VISIBLE_STATUS),
        ),
      )
      .groupBy(articleCategories.id)
      .orderBy(asc(articleCategories.name));
  } catch (error) {
    console.error('Error listing categories with article count:', error);
    throw error;
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const rows = await db
      .select({
        id: articleCategories.id,
        name: articleCategories.name,
        slug: articleCategories.slug,
        description: articleCategories.description,
        createdAt: articleCategories.createdAt,
        updatedAt: articleCategories.updatedAt,
      })
      .from(articleCategories)
      .where(eq(articleCategories.slug, slug))
      .limit(1);

    return rows[0] ?? null;
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    throw error;
  }
}

export async function getCategoryById(categoryId: number) {
  try {
    const rows = await db
      .select({
        id: articleCategories.id,
        name: articleCategories.name,
        slug: articleCategories.slug,
        description: articleCategories.description,
        createdAt: articleCategories.createdAt,
        updatedAt: articleCategories.updatedAt,
      })
      .from(articleCategories)
      .where(eq(articleCategories.id, categoryId))
      .limit(1);

    return rows[0] ?? null;
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    throw error;
  }
}

export async function listCategoryArticles(
  categoryId: number,
  query: CategoryArticlesQuery,
) {
  try {
    return listArticlesWithCount({
      page: query.page,
      limit: query.limit,
      sort: 'newest',
      categoryId,
    });
  } catch (error) {
    console.error('Error listing category articles:', error);
    throw error;
  }
}

export const ArticleService = {
  list: listArticles,
  getBySlug: getArticleBySlug,
  search: searchArticles,
  listByCategoryId: listArticlesByCategoryId,
};

export const CategoryService = {
  list: listCategoriesWithArticleCount,
  getBySlug: getCategoryBySlug,
  getById: getCategoryById,
  listArticles: listCategoryArticles,
};

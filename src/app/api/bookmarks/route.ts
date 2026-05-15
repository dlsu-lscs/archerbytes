import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/util/auth/session';
import { fail, ok, okPaginated, buildPaginationMeta } from '@/lib/api/response';
import { articles } from '@/lib/db/schema';
import { db } from '@/config/database';
import {
  createBookmarkSchema,
  paginationQuerySchema,
  removeBookmarkSchema,
} from '@/features/bookmarks/types';
import { BookmarkService } from '@/features/bookmarks/services/service';

async function getArticleById(articleId: number) {
  const rows = await db
    .select({ id: articles.id })
    .from(articles)
    .where(eq(articles.id, articleId))
    .limit(1);

  return rows[0] ?? null;
}

function getBookmarkPage(limit: number, offset: number) {
  return Math.floor(offset / limit) + 1;
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return fail('Invalid JSON body', 400);
    }

    const parsedBody = createBookmarkSchema.parse(body);
    const article = await getArticleById(parsedBody.articleId);

    if (!article) {
      return fail('Article not found', 404);
    }

    const bookmark = await BookmarkService.create(
      session.user.id,
      parsedBody.articleId,
    );

    if (!bookmark) {
      return fail('Failed to create bookmark', 500);
    }

    return ok({ bookmark }, 201);
  } catch (error) {
    console.error('Error creating bookmark:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return fail('Unauthorized', 401);
    }

    if (error instanceof ZodError) {
      return fail('Validation failed', 400, error.issues);
    }

    return fail('Failed to create bookmark', 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await requireAuth();
    const articleIdParam = req.nextUrl.searchParams.get('articleId');

    const parsedBody = removeBookmarkSchema.parse({ articleId: articleIdParam });
    const existing = await BookmarkService.getByUserAndArticle(
      session.user.id,
      parsedBody.articleId,
    );

    if (!existing || !existing.isBookmarked) {
      return fail('Bookmark not found', 404);
    }

    const bookmark = await BookmarkService.remove(
      session.user.id,
      parsedBody.articleId,
    );

    if (!bookmark) {
      return fail('Failed to remove bookmark', 500);
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error removing bookmark:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return fail('Unauthorized', 401);
    }

    if (error instanceof ZodError) {
      return fail('Validation failed', 400, error.issues);
    }

    return fail('Failed to remove bookmark', 500);
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const limit = req.nextUrl.searchParams.get('limit') ?? undefined;
    const offset = req.nextUrl.searchParams.get('offset') ?? undefined;

    const parsedQuery = paginationQuerySchema.parse({ limit, offset });
    const result = await BookmarkService.listByUserId(
      session.user.id,
      parsedQuery.limit,
      parsedQuery.offset,
    );

    const meta = buildPaginationMeta(
      result.total,
      getBookmarkPage(parsedQuery.limit, parsedQuery.offset),
      parsedQuery.limit,
    );

    return okPaginated(result.items, meta);
  } catch (error) {
    console.error('Error listing bookmarks:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return fail('Unauthorized', 401);
    }

    if (error instanceof ZodError) {
      return fail('Validation failed', 400, error.issues);
    }

    return fail('Failed to list bookmarks', 500);
  }
}
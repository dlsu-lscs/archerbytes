import { NextRequest, NextResponse } from 'next/server';
import { CommentService } from '@/features/comments/services/service';
import {
  createCommentSchema,
  paginationQuerySchema,
} from '@/features/comments/types';
import { requireAuth } from '@/lib/util/auth/session';
import { buildPaginationMeta, fail, ok, okPaginated } from '@/lib/api/response';
import { ZodError } from 'zod';

function getCommentPage(limit: number, offset: number) {
  return Math.floor(offset / limit) + 1;
}

export async function GET(req: NextRequest) {
  try {
    const articleIdParam = req.nextUrl.searchParams.get('articleId');
    const limit = req.nextUrl.searchParams.get('limit') ?? undefined;
    const offset = req.nextUrl.searchParams.get('offset') ?? undefined;

    if (!articleIdParam) {
      return fail('articleId query parameter is required', 400);
    }

    const articleId = Number(articleIdParam);
    if (Number.isNaN(articleId)) {
      return fail('Invalid articleId query parameter', 400);
    }

    const query = paginationQuerySchema.parse({ limit, offset });
    const result = await CommentService.getByArticleID(articleId, query);
    const meta = buildPaginationMeta(
      result.total,
      getCommentPage(query.limit, query.offset),
      query.limit,
    );

    return okPaginated(result.items, meta);
  } catch (error) {
    console.error('Error fetching comments:', error);

    if (error instanceof ZodError) {
      return fail('Validation failed', 400, error.issues);
    }

    return fail('Failed to fetch comments', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const validatedData = createCommentSchema.parse({
      ...body,
      userId: session.user.id,
    });
    const data = await CommentService.create(validatedData);

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 },
      );
    }

    if (error instanceof Error) {
      if (error.message === 'Parent comment does not exist.') {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      if (error.message === 'Can only reply to parent comments.') {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 },
    );
  }
}

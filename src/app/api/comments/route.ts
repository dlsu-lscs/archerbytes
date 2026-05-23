import { NextRequest, NextResponse } from 'next/server';
import { CommentService } from '@/features/comments/services/service';
import { createCommentSchema, paginationQuerySchema } from '@/features/comments/types';
import { ZodError } from 'zod';

export async function GET(req: NextRequest) {
  try {
    const articleIdParam = req.nextUrl.searchParams.get('articleId');

    if (!articleIdParam) {
      return NextResponse.json(
        { error: 'articleId query parameter is required' },
        { status: 400 },
      );
    }

    const articleId = Number(articleIdParam);
    if (Number.isNaN(articleId)) {
      return NextResponse.json(
        { error: 'Invalid articleId query parameter' },
        { status: 400 },
      );
    }

    const limit = Number(req.nextUrl.searchParams.get('limit') ?? 10);
    const offset = Number(req.nextUrl.searchParams.get('offset') ?? 0);
    const query = paginationQuerySchema.parse({ limit, offset });

    const data = await CommentService.getByArticleID(articleId, query);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = createCommentSchema.parse(body);
    const data = await CommentService.create(validatedData);

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);

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

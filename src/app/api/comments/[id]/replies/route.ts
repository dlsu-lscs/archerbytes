import { NextRequest } from 'next/server';
import { CommentService } from '@/features/comments/services/service';
import { paginationQuerySchema } from '@/features/comments/types';
import { buildPaginationMeta, fail, okPaginated } from '@/lib/api/response';
import { ZodError } from 'zod';

function getCommentPage(limit: number, offset: number) {
  return Math.floor(offset / limit) + 1;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id);
    const limit = req.nextUrl.searchParams.get('limit') ?? undefined;
    const offset = req.nextUrl.searchParams.get('offset') ?? undefined;

    if (isNaN(numericId)) {
      return fail('Invalid ID format', 400);
    }

    const parentComment = await CommentService.getById(numericId);
    if (!parentComment) {
      return fail('Parent comment not found', 404);
    }

    const query = paginationQuerySchema.parse({ limit, offset });
    const result = await CommentService.getReplies(numericId, query);
    const meta = buildPaginationMeta(
      result.total,
      getCommentPage(query.limit, query.offset),
      query.limit,
    );

    return okPaginated(result.items, meta);
  } catch (error) {
    console.error('Error fetching replies:', error);

    if (error instanceof ZodError) {
      return fail('Validation failed', 400, error.issues);
    }

    return fail('Failed to fetch replies', 500);
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { CommentService } from '@/features/comments/services/service';
import { paginationQuerySchema } from '@/features/comments/types';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id);

    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const parentComment = await CommentService.getById(numericId);
    if (!parentComment) {
      return NextResponse.json(
        { error: 'Parent comment not found' },
        { status: 404 },
      );
    }

    const limit = Number(req.nextUrl.searchParams.get('limit') ?? 10);
    const offset = Number(req.nextUrl.searchParams.get('offset') ?? 0);
    const query = paginationQuerySchema.parse({ limit, offset });

    const replies = await CommentService.getReplies(numericId, query);

    return NextResponse.json({ data: replies }, { status: 200 });
  } catch (error) {
    console.error('Error fetching replies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch replies' },
      { status: 500 },
    );
  }
}

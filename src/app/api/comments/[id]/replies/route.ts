import { NextRequest, NextResponse } from 'next/server';
import { CommentService } from '@/features/comments/services/service';

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

    const replies = await CommentService.getReplies(numericId);

    return NextResponse.json({ data: replies }, { status: 200 });
  } catch (error) {
    console.error('Error fetching replies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch replies' },
      { status: 500 },
    );
  }
}

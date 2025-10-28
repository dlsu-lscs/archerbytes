import { NextRequest, NextResponse } from 'next/server';
import { CommentService } from '@/features/comments/services/service';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id);
    
    const replies = await CommentService.getReplies(numericId);
    
    return NextResponse.json({ data: replies }, { status: 200 });
  } catch (error) {
    console.error('Error fetching replies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch replies' },
      { status: 500 }
    );
  }
}
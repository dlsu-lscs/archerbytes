import { NextRequest, NextResponse } from 'next/server';
import { CommentService } from '@/features/comments/services/service';
import { updateCommentSchema } from '@/features/comments/types';
import { ZodError } from 'zod';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid comment ID' },
        { status: 400 },
      );
    }

    const comment = await CommentService.getById(id);

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json({ data: comment });
  } catch (error) {
    console.error('Error fetching comment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comment' },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid comment ID' },
        { status: 400 },
      );
    }

    const body = await req.json();

    if (!body.userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 },
      );
    }

    const validatedData = updateCommentSchema.parse(body);
    const comment = await CommentService.update(id, body.userId, validatedData);

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found or you are not allowed to update it' },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: comment });
  } catch (error) {
    console.error('Error updating comment:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid comment ID' },
        { status: 400 },
      );
    }

    const body = await req.json();

    if (!body.userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 },
      );
    }

    const comment = await CommentService.delete(id, body.userId);

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found or you are not allowed to delete it' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: 'Comment deleted successfully',
      data: comment,
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 },
    );
  }
}

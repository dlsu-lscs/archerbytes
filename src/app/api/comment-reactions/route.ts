import { NextRequest, NextResponse } from 'next/server';
import {
  createCommentReaction,
  getCommentReactions,
  deleteCommentReaction,
} from '@/features/reactions/services/service';
import {
  createCommentReactionSchema,
  deleteCommentReactionSchema,
} from '@/features/reactions/types';
import { ZodError } from 'zod';

export async function GET(req: NextRequest) {
  try {
    const commentIdParam = req.nextUrl.searchParams.get('commentId');

    if (!commentIdParam) {
      return NextResponse.json(
        { error: 'commentId query parameter is required' },
        { status: 400 },
      );
    }

    const commentId = Number(commentIdParam);
    if (isNaN(commentId)) {
      return NextResponse.json(
        { error: 'commentId must be a valid number' },
        { status: 400 },
      );
    }

    const reactions = await getCommentReactions(commentId);
    return NextResponse.json({ data: reactions });
  } catch (error) {
    console.error('Error fetching comment reactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comment reactions' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = createCommentReactionSchema.parse(body);
    const reaction = await createCommentReaction(validatedData);

    return NextResponse.json({ data: reaction }, { status: 201 });
  } catch (error) {
    console.error('Error creating comment reaction:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to create comment reaction' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = deleteCommentReactionSchema.parse(body);
    const reaction = await deleteCommentReaction(validatedData);

    if (!reaction) {
      return NextResponse.json(
        { error: 'Reaction not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: 'Reaction deleted successfully',
      data: reaction,
    });
  } catch (error) {
    console.error('Error deleting comment reaction:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete comment reaction' },
      { status: 500 },
    );
  }
}

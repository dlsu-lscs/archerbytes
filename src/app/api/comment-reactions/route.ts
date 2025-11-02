import { NextRequest, NextResponse } from 'next/server';
import { ReactionService } from '@/features/reactions/services/service';
import {
  createCommentReactionSchema,
  deleteCommentReactionSchema,
  updateCommentReactionSchema,
} from '@/features/reactions/types';
import { CommentService } from '@/features/comments/services/service';
import { ZodError } from 'zod';

export async function GET(req: NextRequest) {
  try {
    const commentIdParam = req.nextUrl.searchParams.get('commentId');
    const userId = req.nextUrl.searchParams.get('userId');

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

    if (userId) {
      const reactions = await ReactionService.getReactionsByCommentIdAndUserId(
        commentId,
        userId,
      );
      return NextResponse.json({ data: reactions });
    }

    const totalReactions =
      await ReactionService.getTotalReactionsByCommentId(commentId);
    return NextResponse.json({ data: totalReactions });
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

    const commentExists = await CommentService.getById(validatedData.commentId);
    if (!commentExists) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    const reaction = await ReactionService.createCommentReaction(validatedData);

    if (!reaction) {
      return NextResponse.json(
        { error: 'Failed to create reaction' },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: reaction }, { status: 201 });
  } catch (error) {
    console.error('Error creating comment reaction:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 },
      );
    }
    const errorMessage = error instanceof Error ? error.message : '';
    const errorCause =
      error instanceof Error && 'cause' in error ? error.cause : null;
    const isDuplicate =
      errorMessage.includes('duplicate key value') ||
      errorMessage.includes('unique_user_comment') ||
      (errorCause &&
        typeof errorCause === 'object' &&
        'code' in errorCause &&
        errorCause.code === '23505');

    if (isDuplicate) {
      return NextResponse.json(
        { error: 'You have already reacted to this comment' },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to create comment reaction' },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = updateCommentReactionSchema.parse(body);
    const reaction = await ReactionService.updateCommentReaction(validatedData);

    if (!reaction) {
      return NextResponse.json(
        { error: 'Reaction not found or you are not authorized to update it' },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: reaction });
  } catch (error) {
    console.error('Error updating comment reaction:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to update comment reaction' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = deleteCommentReactionSchema.parse(body);
    const reaction = await ReactionService.deleteCommentReaction(validatedData);

    if (!reaction) {
      return NextResponse.json(
        { error: 'Reaction not found or you are not authorized to delete it' },
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

import { NextRequest, NextResponse } from 'next/server';
import { ReactionService } from '@/features/reactions/services/service';
import {
  createArticleReactionSchema,
  deleteArticleReactionSchema,
  updateArticleReactionSchema,
} from '@/features/reactions/types';
import { ZodError } from 'zod';

export async function GET(req: NextRequest) {
  try {
    const articleId = req.nextUrl.searchParams.get('articleId');
    const userId = req.nextUrl.searchParams.get('userId');

    if (!articleId) {
      return NextResponse.json(
        { error: 'articleId query parameter is required' },
        { status: 400 },
      );
    }

    if (userId) {
      const reactions = await ReactionService.getReactionsByArticleIdAndUserId(
        articleId,
        userId,
      );
      return NextResponse.json({ data: reactions });
    }

    const totalReactions =
      await ReactionService.getTotalReactionsByArticleId(articleId);
    return NextResponse.json({ data: totalReactions });
  } catch (error) {
    console.error('Error fetching article reactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article reactions' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = createArticleReactionSchema.parse(body);
    const reaction = await ReactionService.createArticleReaction(validatedData);

    if (!reaction) {
      return NextResponse.json(
        { error: 'Failed to create reaction' },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: reaction }, { status: 201 });
  } catch (error) {
    console.error('Error creating article reaction:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to create article reaction' },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = updateArticleReactionSchema.parse(body);
    const reaction = await ReactionService.updateArticleReaction(validatedData);

    if (!reaction) {
      return NextResponse.json(
        { error: 'Reaction not found or you are not allowed to update it' },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: reaction });
  } catch (error) {
    console.error('Error updating article reaction:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to update article reaction' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = deleteArticleReactionSchema.parse(body);
    const reaction = await ReactionService.deleteArticleReaction(validatedData);

    if (!reaction) {
      return NextResponse.json(
        { error: 'Reaction not found or you are not allowed to delete it' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: 'Reaction deleted successfully',
      data: reaction,
    });
  } catch (error) {
    console.error('Error deleting article reaction:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete article reaction' },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import {
  createArticleReaction,
  getArticleReactions,
  deleteArticleReaction,
} from '@/features/reactions/services/service';
import {
  createArticleReactionSchema,
  deleteArticleReactionSchema,
} from '@/features/reactions/types';
import { ZodError } from 'zod';

export async function GET(req: NextRequest) {
  try {
    const articleId = req.nextUrl.searchParams.get('articleId');

    if (!articleId) {
      return NextResponse.json(
        { error: 'articleId query parameter is required' },
        { status: 400 },
      );
    }

    const reactions = await getArticleReactions(articleId);
    return NextResponse.json({ data: reactions });
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
    const reaction = await createArticleReaction(validatedData);

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

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = deleteArticleReactionSchema.parse(body);
    const reaction = await deleteArticleReaction(validatedData);

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

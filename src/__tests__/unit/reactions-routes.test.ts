import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { ReactionService } from '@/features/reactions/services/service';
import { CommentService } from '@/features/comments/services/service';
import {
  POST as commentReactionsPOST,
  DELETE as commentReactionsDELETE,
} from '@/app/api/comment-reactions/route';
import {
  POST as articleReactionsPOST,
  PATCH as articleReactionsPATCH,
} from '@/app/api/article-reactions/route';

vi.mock('@/lib/util/auth/session', () => ({
  requireAuth: vi.fn(),
}));

vi.mock('@/features/reactions/services/service', () => ({
  ReactionService: {
    createArticleReaction: vi.fn(),
    updateArticleReaction: vi.fn(),
    deleteArticleReaction: vi.fn(),
    createCommentReaction: vi.fn(),
    updateCommentReaction: vi.fn(),
    deleteCommentReaction: vi.fn(),
    getReactionsByArticleId: vi.fn(),
    getReactionsByArticleIdAndUserId: vi.fn(),
    getReactionsByCommentId: vi.fn(),
    getReactionsByCommentIdAndUserId: vi.fn(),
  },
}));

vi.mock('@/features/comments/services/service', () => ({
  CommentService: {
    getById: vi.fn(),
  },
}));

const mockSession = {
  user: {
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
  },
  session: {
    id: 'session-123',
    expiresAt: new Date(Date.now() + 86400000),
    token: 'token-123',
  },
};

describe('reactions API routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('POST /api/article-reactions requires auth and uses session user id', async () => {
    const { requireAuth } = await import('@/lib/util/auth/session');
    vi.mocked(requireAuth).mockResolvedValue(mockSession as never);
    vi.mocked(ReactionService.createArticleReaction).mockResolvedValue({ id: 1 } as never);

    const req = new NextRequest('http://localhost:3000/api/article-reactions', {
      method: 'POST',
      body: JSON.stringify({ articleId: 42, reactionType: 'like' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await articleReactionsPOST(req);

    expect(res.status).toBe(201);
    expect(ReactionService.createArticleReaction).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'user-123', articleId: 42, reactionType: 'like' }),
    );
  });

  test('PATCH /api/article-reactions returns 401 when not authenticated', async () => {
    const { requireAuth } = await import('@/lib/util/auth/session');
    vi.mocked(requireAuth).mockRejectedValue(new Error('Unauthorized'));

    const req = new NextRequest('http://localhost:3000/api/article-reactions', {
      method: 'PATCH',
      body: JSON.stringify({ articleId: 42, reactionType: 'heart' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await articleReactionsPATCH(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe('Unauthorized');
  });

  test('DELETE /api/comment-reactions requires auth and uses session user id', async () => {
    const { requireAuth } = await import('@/lib/util/auth/session');
    vi.mocked(requireAuth).mockResolvedValue(mockSession as never);
    vi.mocked(ReactionService.deleteCommentReaction).mockResolvedValue({ id: 9 } as never);

    const req = new NextRequest('http://localhost:3000/api/comment-reactions', {
      method: 'DELETE',
      body: JSON.stringify({ commentId: 11 }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await commentReactionsDELETE(req);

    expect(res.status).toBe(200);
    expect(ReactionService.deleteCommentReaction).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'user-123', commentId: 11 }),
    );
  });

  test('POST /api/comment-reactions returns 404 when comment is missing', async () => {
    const { requireAuth } = await import('@/lib/util/auth/session');
    vi.mocked(requireAuth).mockResolvedValue(mockSession as never);
    vi.mocked(CommentService.getById).mockResolvedValue(null as never);

    const req = new NextRequest('http://localhost:3000/api/comment-reactions', {
      method: 'POST',
      body: JSON.stringify({ commentId: 11, reactionType: 'like' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await commentReactionsPOST(req);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe('Comment not found');
  });

  test('POST /api/comment-reactions returns 401 when not authenticated', async () => {
    const { requireAuth } = await import('@/lib/util/auth/session');
    vi.mocked(requireAuth).mockRejectedValue(new Error('Unauthorized'));

    const req = new NextRequest('http://localhost:3000/api/comment-reactions', {
      method: 'POST',
      body: JSON.stringify({ commentId: 11, reactionType: 'like' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await commentReactionsPOST(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe('Unauthorized');
  });
});
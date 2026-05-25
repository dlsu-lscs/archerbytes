import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { CommentService } from '@/features/comments/services/service';
import {
  GET as commentsGET,
  POST as commentsPOST,
} from '@/app/api/comments/route';
import { GET as repliesGET } from '@/app/api/comments/[id]/replies/route';

vi.mock('@/lib/util/auth/session', () => ({
  requireAuth: vi.fn(),
}));

vi.mock('@/features/comments/services/service', () => ({
  CommentService: {
    create: vi.fn(),
    getByArticleID: vi.fn(),
    getById: vi.fn(),
    getReplies: vi.fn(),
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

describe('comments API routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('GET /api/comments returns paginated parent comments', async () => {
    vi.mocked(CommentService.getByArticleID).mockResolvedValue({
      items: [{ id: 1, content: 'Nice post' }],
      total: 1,
      limit: 10,
      offset: 0,
    } as never);

    const req = new NextRequest(
      'http://localhost:3000/api/comments?articleId=42&limit=10&offset=0',
    );
    const res = await commentsGET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.meta).toEqual({ total: 1, page: 1, limit: 10, pages: 1 });
    expect(json.data).toHaveLength(1);
    expect(CommentService.getByArticleID).toHaveBeenCalledWith(42, {
      limit: 10,
      offset: 0,
    });
  });

  test('GET /api/comments returns 400 when articleId is missing', async () => {
    const req = new NextRequest(
      'http://localhost:3000/api/comments?limit=10&offset=0',
    );
    const res = await commentsGET(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('articleId query parameter is required');
  });

  test('POST /api/comments requires auth and uses session user id', async () => {
    const { requireAuth } = await import('@/lib/util/auth/session');
    vi.mocked(requireAuth).mockResolvedValue(mockSession as never);
    vi.mocked(CommentService.create).mockResolvedValue({ id: 5 } as never);

    const req = new NextRequest('http://localhost:3000/api/comments', {
      method: 'POST',
      body: JSON.stringify({ articleId: 42, content: 'Hello', replyTo: null }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await commentsPOST(req);

    expect(res.status).toBe(201);
    expect(CommentService.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'user-123', articleId: 42 }),
    );
  });

  test('POST /api/comments returns 401 when not authenticated', async () => {
    const { requireAuth } = await import('@/lib/util/auth/session');
    vi.mocked(requireAuth).mockRejectedValue(new Error('Unauthorized'));

    const req = new NextRequest('http://localhost:3000/api/comments', {
      method: 'POST',
      body: JSON.stringify({ articleId: 42, content: 'Hello' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await commentsPOST(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe('Unauthorized');
  });

  test('GET /api/comments/[id]/replies returns paginated replies', async () => {
    vi.mocked(CommentService.getById).mockResolvedValue({ id: 11 } as never);
    vi.mocked(CommentService.getReplies).mockResolvedValue({
      items: [{ id: 2, content: 'Reply' }],
      total: 1,
      limit: 10,
      offset: 0,
    } as never);

    const req = new NextRequest(
      'http://localhost:3000/api/comments/11/replies?limit=10&offset=0',
    );
    const res = await repliesGET(req, {
      params: Promise.resolve({ id: '11' }),
    });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.meta).toEqual({ total: 1, page: 1, limit: 10, pages: 1 });
    expect(json.data).toHaveLength(1);
    expect(CommentService.getReplies).toHaveBeenCalledWith(11, {
      limit: 10,
      offset: 0,
    });
  });

  test('GET /api/comments/[id]/replies returns 404 when parent comment is missing', async () => {
    vi.mocked(CommentService.getById).mockResolvedValue(null as never);

    const req = new NextRequest(
      'http://localhost:3000/api/comments/11/replies?limit=10&offset=0',
    );
    const res = await repliesGET(req, {
      params: Promise.resolve({ id: '11' }),
    });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe('Parent comment not found');
  });
});

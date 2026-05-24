import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { BookmarkService } from '@/features/bookmarks/services/service';
import { ArticleService } from '@/features/article/services/service';
import { POST as bookmarksPOST, DELETE as bookmarksDELETE, GET as bookmarksGET } from '@/app/api/bookmarks/route';

// mock the requireAuth function
vi.mock('@/lib/util/auth/session', () => ({
  requireAuth: vi.fn(),
}));

// mock the BookmarkService
vi.mock('@/features/bookmarks/services/service', () => ({
  BookmarkService: {
    create: vi.fn(),
    remove: vi.fn(),
    listByUserId: vi.fn(),
    getByUserAndArticle: vi.fn(),
  },
}));

// mock the ArticleService
vi.mock('@/features/article/services/service', () => ({
  ArticleService: {
    getById: vi.fn(),
  },
}));

// mock the database for article lookup
vi.mock('@/config/database', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue([{ id: 42 }]),
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

describe('bookmarks API routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // post api
  describe('POST /api/bookmarks', () => {
    test('creates bookmark and returns 201 with bookmark data', async () => {
      const { requireAuth } = await import('@/lib/util/auth/session');
      vi.mocked(requireAuth).mockResolvedValue(mockSession as never);

      const now = new Date();
      const mockBookmark = {
        id: 1,
        userId: 'user-123',
        articleId: 42,
        bookmarkedAt: now,
        createdAt: now,
      };
      vi.mocked(ArticleService.getById).mockResolvedValue({ id: 42 } as never);
      vi.mocked(BookmarkService.create).mockResolvedValue(mockBookmark as never);

      const req = new NextRequest('http://localhost:3000/api/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ articleId: 42 }),
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await bookmarksPOST(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.data.bookmark).toBeDefined();
      expect(json.data.bookmark.id).toBe(1);
      expect(json.data.bookmark.articleId).toBe(42);
      expect(vi.mocked(BookmarkService.create)).toHaveBeenCalledWith('user-123', 42);
    });

    test('re-bookmarks article after deletion', async () => {
      const { requireAuth } = await import('@/lib/util/auth/session');
      vi.mocked(requireAuth).mockResolvedValue(mockSession as never);

      const createdAt = new Date('2026-05-14T12:00:00Z');
      const bookmarkedAt = new Date('2026-05-14T12:30:00Z');

      const mockBookmark = {
        id: 2,
        userId: 'user-123',
        articleId: 42,
        bookmarkedAt,
        createdAt,
      };
      vi.mocked(ArticleService.getById).mockResolvedValue({ id: 42 } as never);
      vi.mocked(BookmarkService.create).mockResolvedValue(mockBookmark as never);

      const req = new NextRequest('http://localhost:3000/api/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ articleId: 42 }),
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await bookmarksPOST(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.data.bookmark.id).toBe(2);
    });

    test('returns 409 when bookmark already exists', async () => {
      const { requireAuth } = await import('@/lib/util/auth/session');
      vi.mocked(requireAuth).mockResolvedValue(mockSession as never);
      vi.mocked(ArticleService.getById).mockResolvedValue({ id: 42 } as never);
      vi.mocked(BookmarkService.create).mockRejectedValue(
        new Error('Bookmark already exists'),
      );

      const req = new NextRequest('http://localhost:3000/api/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ articleId: 42 }),
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await bookmarksPOST(req);
      const json = await res.json();

      expect(res.status).toBe(409);
      expect(json.error).toBe('Bookmark already exists');
    });

    test('returns 401 when not authenticated', async () => {
      const { requireAuth } = await import('@/lib/util/auth/session');
      vi.mocked(requireAuth).mockRejectedValue(new Error('Unauthorized'));

      const req = new NextRequest('http://localhost:3000/api/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ articleId: 42 }),
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await bookmarksPOST(req);
      const json = await res.json();

      expect(res.status).toBe(401);
      expect(json.error).toBe('Unauthorized');
    });

    test('returns 400 for invalid articleId', async () => {
      const { requireAuth } = await import('@/lib/util/auth/session');
      vi.mocked(requireAuth).mockResolvedValue(mockSession as never);

      const req = new NextRequest('http://localhost:3000/api/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ articleId: -1 }),
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await bookmarksPOST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toBe('Validation failed');
      expect(Array.isArray(json.details)).toBe(true);
    });

    test('returns 400 for missing articleId', async () => {
      const { requireAuth } = await import('@/lib/util/auth/session');
      vi.mocked(requireAuth).mockResolvedValue(mockSession as never);

      const req = new NextRequest('http://localhost:3000/api/bookmarks', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await bookmarksPOST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toBe('Validation failed');
    });

    test('returns 400 for invalid JSON body', async () => {
      const { requireAuth } = await import('@/lib/util/auth/session');
      vi.mocked(requireAuth).mockResolvedValue(mockSession as never);

      const req = new NextRequest('http://localhost:3000/api/bookmarks', {
        method: 'POST',
        body: 'not json',
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await bookmarksPOST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toBe('Invalid JSON body');
    });

    test('returns 404 when article does not exist', async () => {
      const { requireAuth } = await import('@/lib/util/auth/session');
      vi.mocked(requireAuth).mockResolvedValue(mockSession as never);
      vi.mocked(ArticleService.getById).mockResolvedValue(null as never);

      const req = new NextRequest('http://localhost:3000/api/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ articleId: 999 }),
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await bookmarksPOST(req);
      const json = await res.json();

      expect(res.status).toBe(404);
      expect(json.error).toBe('Article not found');
    });

    test('returns 500 when service throws', async () => {
      const { requireAuth } = await import('@/lib/util/auth/session');
      vi.mocked(requireAuth).mockResolvedValue(mockSession as never);
      vi.mocked(ArticleService.getById).mockResolvedValue({ id: 42 } as never);

      vi.mocked(BookmarkService.create).mockRejectedValue(new Error('db failure'));

      const req = new NextRequest('http://localhost:3000/api/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ articleId: 42 }),
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await bookmarksPOST(req);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.error).toBe('Failed to create bookmark');
    });
  });

  // delete
  describe('DELETE /api/bookmarks', () => {
    test('removes bookmark and returns 204 with no content', async () => {
      const { requireAuth } = await import('@/lib/util/auth/session');
      vi.mocked(requireAuth).mockResolvedValue(mockSession as never);

      const now = new Date();
      const existingBookmark = {
        id: 1,
        userId: 'user-123',
        articleId: 42,
        bookmarkedAt: now,
        createdAt: now,
      };

      vi.mocked(BookmarkService.getByUserAndArticle).mockResolvedValue(
        existingBookmark as never,
      );
      vi.mocked(BookmarkService.remove).mockResolvedValue(existingBookmark as never);

      const req = new NextRequest('http://localhost:3000/api/bookmarks?articleId=42', {
        method: 'DELETE',
      });

      const res = await bookmarksDELETE(req);

      expect(res.status).toBe(204);
      expect(vi.mocked(BookmarkService.remove)).toHaveBeenCalledWith('user-123', 42);
    });

    test('returns 401 when not authenticated', async () => {
      const { requireAuth } = await import('@/lib/util/auth/session');
      vi.mocked(requireAuth).mockRejectedValue(new Error('Unauthorized'));

      const req = new NextRequest('http://localhost:3000/api/bookmarks?articleId=42', {
        method: 'DELETE',
      });

      const res = await bookmarksDELETE(req);
      const json = await res.json();

      expect(res.status).toBe(401);
      expect(json.error).toBe('Unauthorized');
    });

    test('returns 400 for invalid articleId', async () => {
      const { requireAuth } = await import('@/lib/util/auth/session');
      vi.mocked(requireAuth).mockResolvedValue(mockSession as never);

      const req = new NextRequest('http://localhost:3000/api/bookmarks?articleId=-5', {
        method: 'DELETE',
      });

      const res = await bookmarksDELETE(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toBe('Validation failed');
    });

    test('returns 400 for missing articleId', async () => {
      const { requireAuth } = await import('@/lib/util/auth/session');
      vi.mocked(requireAuth).mockResolvedValue(mockSession as never);

      const req = new NextRequest('http://localhost:3000/api/bookmarks', {
        method: 'DELETE',
      });

      const res = await bookmarksDELETE(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toBe('Validation failed');
    });

    test('returns 404 when bookmark does not exist', async () => {
      const { requireAuth } = await import('@/lib/util/auth/session');
      vi.mocked(requireAuth).mockResolvedValue(mockSession as never);
      vi.mocked(BookmarkService.getByUserAndArticle).mockResolvedValue(null as never);

      const req = new NextRequest('http://localhost:3000/api/bookmarks?articleId=42', {
        method: 'DELETE',
      });

      const res = await bookmarksDELETE(req);
      const json = await res.json();

      expect(res.status).toBe(404);
      expect(json.error).toBe('Bookmark not found');
    });

    test('returns 500 when service throws', async () => {
      const { requireAuth } = await import('@/lib/util/auth/session');
      vi.mocked(requireAuth).mockResolvedValue(mockSession as never);

      const now = new Date();
      const existingBookmark = {
        id: 1,
        userId: 'user-123',
        articleId: 42,
        bookmarkedAt: now,
        createdAt: now,
      };

      vi.mocked(BookmarkService.getByUserAndArticle).mockResolvedValue(
        existingBookmark as never,
      );
      vi.mocked(BookmarkService.remove).mockRejectedValue(new Error('db failure'));

      const req = new NextRequest('http://localhost:3000/api/bookmarks?articleId=42', {
        method: 'DELETE',
      });

      const res = await bookmarksDELETE(req);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.error).toBe('Failed to remove bookmark');
    });
  });

  // get
  describe('GET /api/bookmarks', () => {
    test('returns paginated bookmarks with 200', async () => {
      const { requireAuth } = await import('@/lib/util/auth/session');
      vi.mocked(requireAuth).mockResolvedValue(mockSession as never);

      const mockBookmarks = [
        {
          id: 1,
          userId: 'user-123',
          articleId: 42,
          bookmarkedAt: new Date(),
          createdAt: new Date(),
          article: {
            id: 42,
            title: 'Article 1',
            subtitle: 'Subtitle 1',
            slug: 'article-1',
            featuredImageUrl: 'http://example.com/img1.jpg',
            status: 'published',
            isEdited: false,
            publishedAt: new Date(),
            createdAt: new Date(),
            author: {
              id: 'user-789',
              name: 'Author Name',
              avatarURL: 'http://example.com/avatar.jpg',
              occupation: 'Engineer',
            },
            category: {
              id: 5,
              name: 'Web Development',
              slug: 'web-development',
            },
            reactionCount: 24,
            commentCount: 8,
          },
        },
      ];

      vi.mocked(BookmarkService.listByUserId).mockResolvedValue({
        items: mockBookmarks as never,
        total: 1,
        limit: 10,
        offset: 0,
      });

      const req = new NextRequest('http://localhost:3000/api/bookmarks?limit=10&offset=0');

      const res = await bookmarksGET(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data).toHaveLength(1);
      expect(json.meta).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        pages: 1,
      });
      expect(json.data[0].article.title).toBe('Article 1');
    });

    test('returns defaults for limit and offset', async () => {
      const { requireAuth } = await import('@/lib/util/auth/session');
      vi.mocked(requireAuth).mockResolvedValue(mockSession as never);

      vi.mocked(BookmarkService.listByUserId).mockResolvedValue({
        items: [] as never,
        total: 0,
        limit: 10,
        offset: 0,
      });

      const req = new NextRequest('http://localhost:3000/api/bookmarks');

      const res = await bookmarksGET(req);

      expect(res.status).toBe(200);
      expect(vi.mocked(BookmarkService.listByUserId)).toHaveBeenCalledWith('user-123', 10, 0);
    });

    test('returns 401 when not authenticated', async () => {
      const { requireAuth } = await import('@/lib/util/auth/session');
      vi.mocked(requireAuth).mockRejectedValue(new Error('Unauthorized'));

      const req = new NextRequest('http://localhost:3000/api/bookmarks');

      const res = await bookmarksGET(req);
      const json = await res.json();

      expect(res.status).toBe(401);
      expect(json.error).toBe('Unauthorized');
    });

    test('returns 400 for invalid limit', async () => {
      const { requireAuth } = await import('@/lib/util/auth/session');
      vi.mocked(requireAuth).mockResolvedValue(mockSession as never);

      const req = new NextRequest('http://localhost:3000/api/bookmarks?limit=0');

      const res = await bookmarksGET(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toBe('Validation failed');
      expect(Array.isArray(json.details)).toBe(true);
    });

    test('returns 400 for limit exceeding max', async () => {
      const { requireAuth } = await import('@/lib/util/auth/session');
      vi.mocked(requireAuth).mockResolvedValue(mockSession as never);

      const req = new NextRequest('http://localhost:3000/api/bookmarks?limit=200');

      const res = await bookmarksGET(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toBe('Validation failed');
    });

    test('returns 400 for negative offset', async () => {
      const { requireAuth } = await import('@/lib/util/auth/session');
      vi.mocked(requireAuth).mockResolvedValue(mockSession as never);

      const req = new NextRequest('http://localhost:3000/api/bookmarks?offset=-5');

      const res = await bookmarksGET(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toBe('Validation failed');
    });

    test('returns empty list when user has no bookmarks', async () => {
      const { requireAuth } = await import('@/lib/util/auth/session');
      vi.mocked(requireAuth).mockResolvedValue(mockSession as never);

      vi.mocked(BookmarkService.listByUserId).mockResolvedValue({
        items: [] as never,
        total: 0,
        limit: 10,
        offset: 0,
      });

      const req = new NextRequest('http://localhost:3000/api/bookmarks?limit=10&offset=0');

      const res = await bookmarksGET(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data).toHaveLength(0);
      expect(json.meta.total).toBe(0);
    });

    test('returns 500 when service throws', async () => {
      const { requireAuth } = await import('@/lib/util/auth/session');
      vi.mocked(requireAuth).mockResolvedValue(mockSession as never);
      vi.mocked(BookmarkService.listByUserId).mockRejectedValue(new Error('db failure'));

      const req = new NextRequest('http://localhost:3000/api/bookmarks');

      const res = await bookmarksGET(req);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.error).toBe('Failed to list bookmarks');
    });
  });
});

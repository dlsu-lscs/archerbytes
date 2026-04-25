import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { ArticleService, CategoryService } from '@/features/article/services/service';
import { GET as listArticlesGET } from '@/app/api/articles/route';
import { GET as articleBySlugGET } from '@/app/api/articles/[slug]/route';
import { GET as searchArticlesGET } from '@/app/api/articles/search/route';
import { GET as categoryArticlesGET } from '@/app/api/articles/category/[categoryId]/route';

vi.mock('@/features/article/services/service', () => ({
  ArticleService: {
    list: vi.fn(),
    getBySlug: vi.fn(),
    search: vi.fn(),
    listByCategoryId: vi.fn(),
  },
  CategoryService: {
    getById: vi.fn(),
    listArticles: vi.fn(),
    list: vi.fn(),
    getBySlug: vi.fn(),
  },
}));

describe('articles API routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('GET /api/articles returns paginated data', async () => {
    vi.mocked(ArticleService.list).mockResolvedValue({
      items: [{ id: 1, title: 'A' }],
      total: 1,
      page: 1,
      limit: 10,
    } as never);

    const req = new NextRequest('http://localhost:3000/api/articles?page=1&limit=10');
    const res = await listArticlesGET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.meta).toEqual({ total: 1, page: 1, limit: 10, pages: 1 });
    expect(json.data).toHaveLength(1);
  });

  test('GET /api/articles returns 400 for invalid query params', async () => {
    const req = new NextRequest('http://localhost:3000/api/articles?page=0&limit=10');
    const res = await listArticlesGET(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Validation failed');
    expect(Array.isArray(json.details)).toBe(true);
  });

  test('GET /api/articles returns 500 when service throws', async () => {
    vi.mocked(ArticleService.list).mockRejectedValue(new Error('db failure'));

    const req = new NextRequest('http://localhost:3000/api/articles?page=1&limit=10');
    const res = await listArticlesGET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ error: 'Failed to list articles' });
  });

  test('GET /api/articles/search returns 400 for short q', async () => {
    const req = new NextRequest('http://localhost:3000/api/articles/search?q=ab&page=1&limit=10');
    const res = await searchArticlesGET(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Validation failed');
    expect(Array.isArray(json.details)).toBe(true);
  });

  test('GET /api/articles/search returns 500 when service throws', async () => {
    vi.mocked(ArticleService.search).mockRejectedValue(new Error('db failure'));

    const req = new NextRequest(
      'http://localhost:3000/api/articles/search?q=valid&page=1&limit=10',
    );
    const res = await searchArticlesGET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ error: 'Failed to search articles' });
  });

  test('GET /api/articles/[slug] returns 404 when not found', async () => {
    vi.mocked(ArticleService.getBySlug).mockResolvedValue(null as never);

    const req = new NextRequest('http://localhost:3000/api/articles/missing');
    const res = await articleBySlugGET(req, {
      params: Promise.resolve({ slug: 'missing' }),
    });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe('Article not found');
  });

  test('GET /api/articles/[slug] returns 400 for invalid slug param', async () => {
    const req = new NextRequest('http://localhost:3000/api/articles/invalid');
    const res = await articleBySlugGET(req, {
      params: Promise.resolve({ slug: '' }),
    });
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Validation failed');
  });

  test('GET /api/articles/[slug] returns 500 when service throws', async () => {
    vi.mocked(ArticleService.getBySlug).mockRejectedValue(new Error('db failure'));

    const req = new NextRequest('http://localhost:3000/api/articles/sample-slug');
    const res = await articleBySlugGET(req, {
      params: Promise.resolve({ slug: 'sample-slug' }),
    });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ error: 'Failed to fetch article' });
  });

  test('GET /api/articles/category/[categoryId] returns 404 for unknown category', async () => {
    vi.mocked(CategoryService.getById).mockResolvedValue(null as never);

    const req = new NextRequest('http://localhost:3000/api/articles/category/5?page=1&limit=10');
    const res = await categoryArticlesGET(req, {
      params: Promise.resolve({ categoryId: '5' }),
    });

    expect(res.status).toBe(404);
  });

  test('GET /api/articles/category/[categoryId] returns 400 for invalid sort', async () => {
    const req = new NextRequest(
      'http://localhost:3000/api/articles/category/5?page=1&limit=10&sort=invalid',
    );
    const res = await categoryArticlesGET(req, {
      params: Promise.resolve({ categoryId: '5' }),
    });
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Validation failed');
  });

  test('GET /api/articles/category/[categoryId] returns 500 when service throws', async () => {
    vi.mocked(CategoryService.getById).mockResolvedValue({ id: 5 } as never);
    vi.mocked(ArticleService.listByCategoryId).mockRejectedValue(
      new Error('db failure'),
    );

    const req = new NextRequest('http://localhost:3000/api/articles/category/5?page=1&limit=10');
    const res = await categoryArticlesGET(req, {
      params: Promise.resolve({ categoryId: '5' }),
    });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ error: 'Failed to list articles by category' });
  });
});

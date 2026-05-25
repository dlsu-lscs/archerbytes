import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { CategoryService } from '@/features/article/services/service';
import { GET as listCategoriesGET } from '@/app/api/categories/route';
import { GET as categoryBySlugGET } from '@/app/api/categories/[slug]/route';
import { GET as categoryArticlesGET } from '@/app/api/categories/by-id/[id]/articles/route';

vi.mock('@/features/article/services/service', () => ({
  ArticleService: {
    list: vi.fn(),
    getBySlug: vi.fn(),
    search: vi.fn(),
    listByCategoryId: vi.fn(),
  },
  CategoryService: {
    list: vi.fn(),
    getBySlug: vi.fn(),
    getById: vi.fn(),
    listArticles: vi.fn(),
  },
}));

describe('categories API routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('GET /api/categories returns data', async () => {
    vi.mocked(CategoryService.list).mockResolvedValue([
      { id: 1, name: 'Tech', slug: 'tech', articleCount: 3 },
    ] as never);

    const res = await listCategoriesGET();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data[0].slug).toBe('tech');
  });

  test('GET /api/categories returns 500 when service throws', async () => {
    vi.mocked(CategoryService.list).mockRejectedValue(new Error('db failure'));

    const res = await listCategoriesGET();
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ error: 'Failed to list categories' });
  });

  test('GET /api/categories/[slug] returns 404 when missing', async () => {
    vi.mocked(CategoryService.getBySlug).mockResolvedValue(null as never);

    const res = await categoryBySlugGET(
      new Request('http://localhost:3000/api/categories/missing'),
      {
        params: Promise.resolve({ slug: 'missing' }),
      },
    );

    expect(res.status).toBe(404);
  });

  test('GET /api/categories/[slug] returns 400 for invalid slug param', async () => {
    const res = await categoryBySlugGET(
      new Request('http://localhost:3000/api/categories/invalid'),
      {
        params: Promise.resolve({ slug: '' }),
      },
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Validation failed');
  });

  test('GET /api/categories/[slug] returns 500 when service throws', async () => {
    vi.mocked(CategoryService.getBySlug).mockRejectedValue(
      new Error('db failure'),
    );

    const res = await categoryBySlugGET(
      new Request('http://localhost:3000/api/categories/tech'),
      {
        params: Promise.resolve({ slug: 'tech' }),
      },
    );
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ error: 'Failed to fetch category' });
  });

  test('GET /api/categories/by-id/[id]/articles returns paginated data', async () => {
    vi.mocked(CategoryService.getById).mockResolvedValue({
      id: 2,
      slug: 'news',
      name: 'News',
    } as never);
    vi.mocked(CategoryService.listArticles).mockResolvedValue({
      items: [{ id: 11, slug: 'latest-news' }],
      total: 1,
      page: 1,
      limit: 10,
    } as never);

    const req = new NextRequest(
      'http://localhost:3000/api/categories/by-id/2/articles?page=1&limit=10',
    );
    const res = await categoryArticlesGET(req, {
      params: Promise.resolve({ id: '2' }),
    });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.meta).toEqual({ total: 1, page: 1, limit: 10, pages: 1 });
    expect(json.data).toHaveLength(1);
  });

  test('GET /api/categories/by-id/[id]/articles returns 400 for invalid id', async () => {
    const req = new NextRequest(
      'http://localhost:3000/api/categories/by-id/nope/articles?page=1&limit=10',
    );
    const res = await categoryArticlesGET(req, {
      params: Promise.resolve({ id: 'nope' }),
    });

    expect(res.status).toBe(400);
  });

  test('GET /api/categories/by-id/[id]/articles returns 404 when category is missing', async () => {
    vi.mocked(CategoryService.getById).mockResolvedValue(null as never);

    const req = new NextRequest(
      'http://localhost:3000/api/categories/by-id/2/articles?page=1&limit=10',
    );
    const res = await categoryArticlesGET(req, {
      params: Promise.resolve({ id: '2' }),
    });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json).toEqual({ error: 'Category not found' });
  });

  test('GET /api/categories/by-id/[id]/articles returns 500 when service throws', async () => {
    vi.mocked(CategoryService.getById).mockResolvedValue({ id: 2 } as never);
    vi.mocked(CategoryService.listArticles).mockRejectedValue(
      new Error('db failure'),
    );

    const req = new NextRequest(
      'http://localhost:3000/api/categories/by-id/2/articles?page=1&limit=10',
    );
    const res = await categoryArticlesGET(req, {
      params: Promise.resolve({ id: '2' }),
    });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ error: 'Failed to list category articles' });
  });
});

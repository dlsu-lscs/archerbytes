import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const cmsArticle = {
  id: 1,
  title: 'Test Article',
  subtitle: 'Subtitle',
  slug: 'test-article',
  content: { root: { type: 'root', children: [] } },
  category: { id: 2, name: 'News' },
  createdAt: '2026-05-04T00:00:00.000Z',
  updatedAt: '2026-05-04T00:00:00.000Z',
};

describe('CMS API client', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.resetModules();
    process.env.CMS_API_URL = 'http://cms.test';
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
    delete process.env.CMS_API_URL;
  });

  it('fetches articles by slug using the list endpoint', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({ docs: [cmsArticle] }),
    });

    const { cmsApiClient } = await import('@/lib/cms-api');
    const article = await cmsApiClient.fetchArticle('test-article');

    expect(fetchMock).toHaveBeenCalledWith(
      'http://cms.test/api/archerbytes-articles?where[slug][equals]=test-article&limit=1&depth=1',
      expect.objectContaining({ method: 'GET' })
    );
    expect(article.slug).toBe('test-article');
  });

  it('fetches articles by numeric id using the document endpoint', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({ doc: cmsArticle }),
    });

    const { cmsApiClient } = await import('@/lib/cms-api');
    const article = await cmsApiClient.fetchArticle(42);

    expect(fetchMock).toHaveBeenCalledWith(
      'http://cms.test/api/archerbytes-articles/42?depth=1',
      expect.objectContaining({ method: 'GET' })
    );
    expect(article.id).toBe(1);
  });
});
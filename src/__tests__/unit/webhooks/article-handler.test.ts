import { describe, it, expect, beforeEach, vi } from 'vitest';
import { handleArticleEvent } from '@/lib/webhooks/handlers/article.handler';
import { CMSSyncService } from '@/features/article/services/cms-sync.service';
import type { ArticleWebhookPayload } from '@/lib/webhooks/types';

vi.mock('@/lib/cms-api', () => ({
  cmsApiClient: {
    fetchArticle: vi.fn(),
    fetchCategory: vi.fn(),
  },
}));

vi.mock('@/config/database', () => ({
  db: {
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    onConflictDoUpdate: vi.fn().mockReturnThis(),
    target: undefined,
    set: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([{ id: 1, slug: 'test-article' }]),
    limit: vi.fn().mockResolvedValue([]),
  },
}));

describe('Article Event Handler', () => {
  const mockArticlePayload: ArticleWebhookPayload = {
    event: 'article',
    action: 'created',
    articleId: 'test-article-slug',
    timestamp: new Date().toISOString(),
    cms: 'payload-cms',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Article creation event', () => {
    it('should handle article.created event', async () => {
      const syncSpy = vi
        .spyOn(CMSSyncService, 'syncArticle')
        .mockResolvedValue({
          id: 1,
          slug: 'test-article',
        });

      const payload: ArticleWebhookPayload = {
        ...mockArticlePayload,
        action: 'created',
      };

      await handleArticleEvent(payload);

      expect(syncSpy).toHaveBeenCalledWith('test-article-slug');
    });

    it('should handle article.updated event', async () => {
      const syncSpy = vi
        .spyOn(CMSSyncService, 'syncArticle')
        .mockResolvedValue({
          id: 1,
          slug: 'test-article',
        });

      const payload: ArticleWebhookPayload = {
        ...mockArticlePayload,
        action: 'updated',
      };

      await handleArticleEvent(payload);

      expect(syncSpy).toHaveBeenCalledWith('test-article-slug');
    });
  });

  describe('Article deletion event', () => {
    it('should handle article.deleted event', async () => {
      const deleteSpy = vi
        .spyOn(CMSSyncService, 'deleteArticle')
        .mockResolvedValue();

      const payload: ArticleWebhookPayload = {
        ...mockArticlePayload,
        action: 'deleted',
      };

      await handleArticleEvent(payload);

      expect(deleteSpy).toHaveBeenCalledWith('test-article-slug');
    });
  });

  describe('Error handling', () => {
    it('should throw error when sync fails', async () => {
      vi.spyOn(CMSSyncService, 'syncArticle').mockRejectedValue(
        new Error('CMS API error'),
      );

      const payload: ArticleWebhookPayload = {
        ...mockArticlePayload,
        action: 'created',
      };

      await expect(handleArticleEvent(payload)).rejects.toThrow(
        'CMS API error',
      );
    });

    it('should log error details', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      vi.spyOn(CMSSyncService, 'syncArticle').mockRejectedValue(
        new Error('Test error'),
      );

      const payload: ArticleWebhookPayload = {
        ...mockArticlePayload,
        action: 'created',
      };

      try {
        await handleArticleEvent(payload);
      } catch {}

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});

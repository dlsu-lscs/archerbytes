import { describe, it, expect, beforeEach, vi } from 'vitest';
import { handleCategoryEvent } from '@/lib/webhooks/handlers/category.handler';
import { CMSSyncService } from '@/features/article/services/cms-sync.service';
import type { CategoryWebhookPayload } from '@/lib/webhooks/types';

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
    returning: vi.fn().mockResolvedValue([{ id: 1, name: 'Tech News' }]),
    limit: vi.fn().mockResolvedValue([]),
  },
}));

describe('Category Event Handler', () => {
  const mockCategoryPayload: CategoryWebhookPayload = {
    event: 'category',
    action: 'created',
    categoryId: 'tech-news',
    timestamp: new Date().toISOString(),
    cms: 'payload-cms',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('syncs categories on create and update', async () => {
    const syncSpy = vi.spyOn(CMSSyncService, 'syncCategory').mockResolvedValue({
      id: 1,
      name: 'Tech News',
    });

    await handleCategoryEvent(mockCategoryPayload);
    await handleCategoryEvent({ ...mockCategoryPayload, action: 'updated' });

    expect(syncSpy).toHaveBeenCalledTimes(2);
    expect(syncSpy).toHaveBeenNthCalledWith(1, 'tech-news');
    expect(syncSpy).toHaveBeenNthCalledWith(2, 'tech-news');
  });

  it('ignores delete events', async () => {
    const syncSpy = vi.spyOn(CMSSyncService, 'syncCategory').mockResolvedValue({
      id: 1,
      name: 'Tech News',
    });

    await handleCategoryEvent({ ...mockCategoryPayload, action: 'deleted' });

    expect(syncSpy).not.toHaveBeenCalled();
  });
});

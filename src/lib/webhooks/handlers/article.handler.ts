import { type ArticleWebhookPayload } from '../types';
import { CMSSyncService } from '@/features/article/services/cms-sync.service';

export async function handleArticleEvent(payload: ArticleWebhookPayload): Promise<void> {
  const { action, articleId } = payload as ArticleWebhookPayload & { articleId: string };

  try {
    if (action === 'created' || action === 'updated') {
      await CMSSyncService.syncArticle(articleId);
    } else if (action === 'deleted') {
      await CMSSyncService.deleteArticle(articleId);
    }
  } catch (error) {
    console.error(`[Webhook Handler] Failed to handle article:${action}:`, { articleId, error });
    throw error;
  }
}

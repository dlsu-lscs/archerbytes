import { type CategoryWebhookPayload } from '../types';
import { CMSSyncService } from '@/features/article/services/cms-sync.service';

export async function handleCategoryEvent(payload: CategoryWebhookPayload): Promise<void> {
  const { action, categoryId } = payload as CategoryWebhookPayload & { categoryId: string };

  try {
    if (action === 'created' || action === 'updated') {
      await CMSSyncService.syncCategory(categoryId);
    }
  } catch (error) {
    console.error(`[Webhook Handler] Failed to handle category:${action}:`, { categoryId, error });
    throw error;
  }
}

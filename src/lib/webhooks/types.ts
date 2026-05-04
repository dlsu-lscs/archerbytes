import { z } from 'zod';

export const ArticleWebhookPayloadSchema = z.object({
  event: z.literal('article'),
  action: z.enum(['created', 'updated', 'deleted']),
  articleId: z.string().min(1, 'articleId is required'),
  timestamp: z.iso.datetime(),
  cms: z.string().optional(),
});

export type ArticleWebhookPayload = z.infer<typeof ArticleWebhookPayloadSchema>;

export const CategoryWebhookPayloadSchema = z.object({
  event: z.literal('category'),
  action: z.enum(['created', 'updated', 'deleted']),
  categoryId: z.string().min(1, 'categoryId is required'),
  timestamp: z.iso.datetime(),
  cms: z.string().optional(),
});

export type CategoryWebhookPayload = z.infer<typeof CategoryWebhookPayloadSchema>;

export const WebhookPayloadSchema = z.discriminatedUnion('event', [
  ArticleWebhookPayloadSchema,
  CategoryWebhookPayloadSchema,
]);

export type WebhookPayload = z.infer<typeof WebhookPayloadSchema>;

export interface WebhookResponse {
  status: 'accepted' | 'rejected' | 'error';
  message: string;
  id: string;
  timestamp: string;
  details?: unknown;
}

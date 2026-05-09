import { NextRequest } from 'next/server';
import { WebhookPayloadSchema } from '@/lib/webhooks/types';
import { validateWebhookAuth } from '@/lib/webhooks/auth';
import { accepted, badRequest, unauthorized } from '@/lib/webhooks/response';
import { handleArticleEvent } from '@/lib/webhooks/handlers/article.handler';
import { handleCategoryEvent } from '@/lib/webhooks/handlers/category.handler';

export async function POST(req: NextRequest) {
  const authResult = validateWebhookAuth(req);
  if (!authResult.valid) {
    console.warn(`[Webhook] Unauthorized request: ${authResult.error}`);
    return unauthorized(authResult.error);
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch (error) {
    const errorMsg = 'Failed to parse JSON body';
    console.error(`[Webhook] ${errorMsg}:`, error);
    return badRequest(errorMsg);
  }

  const validationResult = WebhookPayloadSchema.safeParse(payload);
  if (!validationResult.success) {
    const errorMsg = 'Invalid webhook payload schema';
    console.warn(`[Webhook] ${errorMsg}:`, validationResult.error.issues);
    return badRequest(errorMsg, validationResult.error.issues);
  }

  const webhookPayload = validationResult.data;
  console.log(`[Webhook] Received ${webhookPayload.event} event for ID: ${
    'articleId' in webhookPayload ? webhookPayload.articleId : webhookPayload.categoryId
  } at ${webhookPayload.timestamp}`);

  (async () => {
    try {
      if (webhookPayload.event === 'article') {
        await handleArticleEvent(webhookPayload);
      } else if (webhookPayload.event === 'category') {
        await handleCategoryEvent(webhookPayload);
      }
    } catch (error) {
      console.error(`[Webhook] Processing failed for ${webhookPayload.event}:`, error);
    }
  })();

  return accepted('Webhook received and queued for processing');
}
import { NextResponse } from 'next/server';
import { WebhookResponse } from './types';

function generateWebhookId(): string {
  return `wh_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function accepted(message: string = 'Webhook received and queued for processing'): NextResponse<WebhookResponse> {
  const response: WebhookResponse = {
    status: 'accepted',
    message,
    id: generateWebhookId(),
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, { status: 202 });
}

export function badRequest(message: string, details?: unknown): NextResponse<WebhookResponse> {
  const response: WebhookResponse = {
    status: 'rejected',
    message,
    id: generateWebhookId(),
    timestamp: new Date().toISOString(),
    details,
  };

  return NextResponse.json(response, { status: 400 });
}

export function unauthorized(message: string = 'Unauthorized: Invalid webhook secret'): NextResponse<WebhookResponse> {
  const response: WebhookResponse = {
    status: 'rejected',
    message,
    id: generateWebhookId(),
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, { status: 401 });
}

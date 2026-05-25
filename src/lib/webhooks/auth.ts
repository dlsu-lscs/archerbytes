import { NextRequest } from 'next/server';

export function extractBearerToken(req: NextRequest): string | undefined {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader) {
    return undefined;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return undefined;
  }

  return parts[1];
}
export function verifyWebhookSecret(token: string): boolean {
  const webhookSecret = process.env.WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('WEBHOOK_SECRET environment variable is not configured');
    return false;
  }

  return constantTimeCompare(token, webhookSecret);
}

function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

export function validateWebhookAuth(req: NextRequest): {
  valid: boolean;
  error?: string;
} {
  const token = extractBearerToken(req);

  if (!token) {
    return {
      valid: false,
      error:
        'Missing or invalid Authorization header. Expected: Authorization: Bearer <token>',
    };
  }

  if (!verifyWebhookSecret(token)) {
    return {
      valid: false,
      error: 'Invalid webhook secret',
    };
  }

  return { valid: true };
}

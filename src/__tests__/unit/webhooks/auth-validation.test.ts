import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { POST } from '@/app/api/webhooks/cms/route';
import { NextRequest } from 'next/server';

vi.mock('@/config/database', () => ({
  db: {},
}));

vi.mock('@/lib/cms-api', () => ({
  cmsApiClient: {},
}));

beforeEach(() => {
  process.env.WEBHOOK_SECRET = 'test-webhook-secret-123';
});

afterEach(() => {
  delete process.env.WEBHOOK_SECRET;
  vi.clearAllMocks();
});

function createMockRequest(
  body: unknown,
  options?: {
    authHeader?: string;
  },
): NextRequest {
  const headers = new Headers();

  if (options?.authHeader) {
    headers.set('Authorization', options.authHeader);
  }

  return new NextRequest('http://localhost:3000/api/webhooks/cms', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
}

describe('CMS Webhook Endpoint', () => {
  describe('Authentication', () => {
    it('should return 401 when Authorization header is missing', async () => {
      const req = createMockRequest({
        event: 'article',
        action: 'created',
        articleId: '123',
        timestamp: new Date().toISOString(),
      });

      const response = await POST(req);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.status).toBe('rejected');
      expect(data.message).toContain('Authorization header');
    });

    it('should return 401 when Authorization header has invalid format', async () => {
      const req = createMockRequest(
        {
          event: 'article',
          action: 'created',
          articleId: '123',
          timestamp: new Date().toISOString(),
        },
        { authHeader: 'InvalidFormat token-here' },
      );

      const response = await POST(req);

      expect(response.status).toBe(401);
    });

    it('should return 401 when Bearer token is incorrect', async () => {
      const req = createMockRequest(
        {
          event: 'article',
          action: 'created',
          articleId: '123',
          timestamp: new Date().toISOString(),
        },
        { authHeader: 'Bearer wrong-secret' },
      );

      const response = await POST(req);

      expect(response.status).toBe(401);
    });

    it('should accept valid Bearer token', async () => {
      const req = createMockRequest(
        {
          event: 'article',
          action: 'created',
          articleId: '123',
          timestamp: new Date().toISOString(),
        },
        { authHeader: 'Bearer test-webhook-secret-123' },
      );

      const response = await POST(req);

      expect(response.status).not.toBe(401);
    });
  });

  describe('Payload Validation', () => {
    const validAuthHeader = 'Bearer test-webhook-secret-123';

    it('should return 400 when JSON is malformed', async () => {
      const headers = new Headers();
      headers.set('Authorization', validAuthHeader);

      const req = new NextRequest('http://localhost:3000/api/webhooks/cms', {
        method: 'POST',
        headers,
        body: 'not-valid-json{',
      });

      const response = await POST(req);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.status).toBe('rejected');
      expect(data.message).toContain('JSON');
    });

    it('should return 400 when event field is missing', async () => {
      const req = createMockRequest(
        {
          articleId: '123',
          timestamp: new Date().toISOString(),
        },
        { authHeader: validAuthHeader },
      );

      const response = await POST(req);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.status).toBe('rejected');
      expect(data.details).toBeDefined();
    });

    it('should return 400 when articleId is missing for article event', async () => {
      const req = createMockRequest(
        {
          event: 'article',
          action: 'created',
          timestamp: new Date().toISOString(),
        },
        { authHeader: validAuthHeader },
      );

      const response = await POST(req);

      expect(response.status).toBe(400);
    });

    it('should return 400 when timestamp is invalid', async () => {
      const req = createMockRequest(
        {
          event: 'article',
          action: 'created',
          articleId: '123',
          timestamp: 'not-a-valid-timestamp',
        },
        { authHeader: validAuthHeader },
      );

      const response = await POST(req);

      expect(response.status).toBe(400);
    });

    it('should return 400 for unsupported event type', async () => {
      const req = createMockRequest(
        {
          event: 'unknown',
          action: 'created',
          articleId: '123',
          timestamp: new Date().toISOString(),
        },
        { authHeader: validAuthHeader },
      );

      const response = await POST(req);

      expect(response.status).toBe(400);
    });
  });

  describe('Valid Payloads', () => {
    const validAuthHeader = 'Bearer test-webhook-secret-123';

    it('should return 202 for valid article.created event', async () => {
      const req = createMockRequest(
        {
          event: 'article',
          action: 'created',
          articleId: 'my-article-slug',
          timestamp: new Date().toISOString(),
        },
        { authHeader: validAuthHeader },
      );

      const response = await POST(req);

      expect(response.status).toBe(202);
      const data = await response.json();
      expect(data.status).toBe('accepted');
      expect(data.id).toBeDefined();
      expect(data.timestamp).toBeDefined();
    });

    it('should return 202 for valid article.updated event', async () => {
      const req = createMockRequest(
        {
          event: 'article',
          action: 'updated',
          articleId: '456',
          timestamp: new Date().toISOString(),
        },
        { authHeader: validAuthHeader },
      );

      const response = await POST(req);

      expect(response.status).toBe(202);
    });

    it('should return 202 for valid article.deleted event', async () => {
      const req = createMockRequest(
        {
          event: 'article',
          action: 'deleted',
          articleId: '789',
          timestamp: new Date().toISOString(),
        },
        { authHeader: validAuthHeader },
      );

      const response = await POST(req);

      expect(response.status).toBe(202);
    });

    it('should return 202 for valid category.created event', async () => {
      const req = createMockRequest(
        {
          event: 'category',
          action: 'created',
          categoryId: 'tech-news',
          timestamp: new Date().toISOString(),
        },
        { authHeader: validAuthHeader },
      );

      const response = await POST(req);

      expect(response.status).toBe(202);
      const data = await response.json();
      expect(data.status).toBe('accepted');
    });

    it('should return 202 for valid category.updated event', async () => {
      const req = createMockRequest(
        {
          event: 'category',
          action: 'updated',
          categoryId: '100',
          timestamp: new Date().toISOString(),
        },
        { authHeader: validAuthHeader },
      );

      const response = await POST(req);

      expect(response.status).toBe(202);
    });

    it('should return 202 for valid category.deleted event', async () => {
      const req = createMockRequest(
        {
          event: 'category',
          action: 'deleted',
          categoryId: '200',
          timestamp: new Date().toISOString(),
        },
        { authHeader: validAuthHeader },
      );

      const response = await POST(req);

      expect(response.status).toBe(202);
    });

    it('should include webhook ID for tracking', async () => {
      const req = createMockRequest(
        {
          event: 'article',
          action: 'created',
          articleId: 'test-article',
          timestamp: new Date().toISOString(),
        },
        { authHeader: validAuthHeader },
      );

      const response = await POST(req);

      const data = await response.json();
      expect(data.id).toMatch(/^wh_\d+_/);
    });

    it('should accept optional cms field', async () => {
      const req = createMockRequest(
        {
          event: 'article',
          action: 'created',
          articleId: '123',
          timestamp: new Date().toISOString(),
          cms: 'payload-cms',
        },
        { authHeader: validAuthHeader },
      );

      const response = await POST(req);

      expect(response.status).toBe(202);
    });
  });

  describe('Edge Cases', () => {
    const validAuthHeader = 'Bearer test-webhook-secret-123';

    it('should handle numeric articleId as string', async () => {
      const req = createMockRequest(
        {
          event: 'article',
          action: 'created',
          articleId: '12345',
          timestamp: new Date().toISOString(),
        },
        { authHeader: validAuthHeader },
      );

      const response = await POST(req);

      expect(response.status).toBe(202);
    });

    it('should reject empty articleId', async () => {
      const req = createMockRequest(
        {
          event: 'article',
          action: 'created',
          articleId: '',
          timestamp: new Date().toISOString(),
        },
        { authHeader: validAuthHeader },
      );

      const response = await POST(req);

      expect(response.status).toBe(400);
    });

    it('should handle future timestamps', async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 24);

      const req = createMockRequest(
        {
          event: 'article',
          action: 'created',
          articleId: '123',
          timestamp: futureDate.toISOString(),
        },
        { authHeader: validAuthHeader },
      );

      const response = await POST(req);

      expect(response.status).toBe(202);
    });
  });
});

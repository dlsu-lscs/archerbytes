export interface CMSArticle {
  id: string | number;
  title: string;
  subtitle: string;
  slug: string;
  content: { root: { type: string; children: unknown[] }; [key: string]: unknown };
  mdContent?: string | null;
  featuredImage?: { id: number; url: string } | number | null;
  category: { id: number; name: string } | number;
  author?: { id: number; name: string } | number;
  tags?: string[] | null;
  meta?: {
    title?: string | null;
    image?: { id: number; url: string } | number | null;
    description?: string | null;
  };
  _status?: 'draft' | 'published' | null;
  createdAt: string;
  updatedAt: string;
}

export interface CMSCategory {
  id: string | number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

class CMSApiClient {
  private baseUrl: string;

  constructor() {
    const url = process.env.CMS_API_URL;
    if (!url) {
      throw new Error('CMS_API_URL environment variable is not configured');
    }
    this.baseUrl = url.replace(/\/+$/, '');
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    const cmsApiKey = process.env.CMS_API_KEY
    if (cmsApiKey) {
      headers['Authorization'] = `users API-Key ${cmsApiKey}`
    }
    return headers
  }

  private normalizeArticle(article: CMSArticle): CMSArticle | null {
    const { deleted_at, ...normalized } = article as CMSArticle & { deleted_at?: unknown }
    
    // if the CMS marked the article as deleted, reject it
    if (deleted_at) {
      return null
    }
    
    return normalized as CMSArticle
  }

  private normalizeCategory(category: CMSCategory): CMSCategory | null {
    const { deleted_at, ...normalized } = category as CMSCategory & { deleted_at?: unknown }
    
    // if the CMS marked the article as deleted, reject it
    if (deleted_at) {
      return null
    }
    
    return normalized as CMSCategory
  }

  async fetchArticle(articleId: string | number): Promise<CMSArticle> {
    const normalizedArticleId = String(articleId).trim();
    const url = this.isNumericId(normalizedArticleId)
      ? `${this.baseUrl}/api/archerbytes-articles/${encodeURIComponent(normalizedArticleId)}?depth=1`
      : `${this.baseUrl}/api/archerbytes-articles?where[slug][equals]=${encodeURIComponent(normalizedArticleId)}&limit=1&depth=1`;

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`CMS API error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as unknown;
    const article = this.extractCMSData<CMSArticle>(data);
    if (!article) {
      throw new Error(`CMS article not found for identifier: ${normalizedArticleId}`);
    }

    const normalizedArticle = this.normalizeArticle(article);
    if (!normalizedArticle) {
      throw new Error(`Article is deleted in CMS: ${normalizedArticleId}`);
    }

    return normalizedArticle;
  }

  async fetchCategory(categoryId: string | number): Promise<CMSCategory> {
    const url = `${this.baseUrl}/api/archerbytes-article-category/${encodeURIComponent(String(categoryId).trim())}?depth=1`;

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`CMS API error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as unknown;
    const category = this.extractCMSData<CMSCategory>(data);
    if (!category) {
      throw new Error(`CMS category not found for identifier: ${String(categoryId).trim()}`);
    }

    const normalizedCategory = this.normalizeCategory(category);
    if (!normalizedCategory) {
      throw new Error(`Category is deleted in CMS: ${String(categoryId).trim()}`);
    }

    return normalizedCategory;
  }

  private extractCMSData<T>(data: unknown): T {
    if (data && typeof data === 'object' && 'data' in data) {
      return (data as { data: T }).data;
    }
    if (data && typeof data === 'object' && 'doc' in data) {
      return (data as { doc: T }).doc;
    }
    if (data && typeof data === 'object' && 'docs' in data) {
      const docs = (data as { docs?: T[] }).docs;
      return docs && docs.length > 0 ? docs[0] : (undefined as T);
    }
    return data as T;
  }

  private isNumericId(value: string): boolean {
    return /^\d+$/.test(value);
  }
}

export const cmsApiClient = new CMSApiClient();

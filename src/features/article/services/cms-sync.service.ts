import { db } from '@/config/database';
import { articles, articleCategories } from '@/lib/db/schema';
import { cmsApiClient } from '@/lib/cms-api';
import { eq } from 'drizzle-orm';

const SYSTEM_USER_ID = process.env.SYSTEM_USER_ID || 'system';

export class CMSSyncService {
  static async syncArticle(articleId: string | number): Promise<{ id: number; slug: string }> {
    const cmsArticle = await cmsApiClient.fetchArticle(articleId);
    const cmsArticleId = typeof cmsArticle.id === 'string' ? parseInt(cmsArticle.id, 10) : cmsArticle.id;

    const categoryId = typeof cmsArticle.category === 'number' 
      ? cmsArticle.category 
      : cmsArticle.category.id;

    const existingCategory = await db
      .select({ id: articleCategories.id })
      .from(articleCategories)
      .where(eq(articleCategories.id, categoryId))
      .limit(1);

    if (!existingCategory.length) {
      await CMSSyncService.syncCategory(categoryId);
    }

    const articleData = {
      cmsArticleId,
      title: cmsArticle.title,
      subtitle: cmsArticle.subtitle,
      slug: cmsArticle.slug,
      content: JSON.stringify(cmsArticle.content),
      categoryId,
      userId: SYSTEM_USER_ID,
      featuredImageUrl: this.extractImageUrl(cmsArticle.featuredImage),
      tags: cmsArticle.tags || [],
      metaTitle: cmsArticle.meta?.title || null,
      metaDescription: cmsArticle.meta?.description || null,
      metaImageUrl: this.extractImageUrl(cmsArticle.meta?.image),
      status: (cmsArticle._status || 'draft') as 'draft' | 'published',
      publishedAt: cmsArticle._status === 'published' 
        ? new Date(cmsArticle.updatedAt) 
        : null,
      updatedAt: new Date(cmsArticle.updatedAt),
    };

    const result = await db
      .insert(articles)
      .values(articleData)
      .onConflictDoUpdate({
        target: articles.cmsArticleId,
        set: articleData,
      })
      .returning({ id: articles.id, slug: articles.slug });

    if (!result.length) {
      throw new Error(`Failed to sync article: ${articleId}`);
    }

    return result[0];
  }

  static async syncCategory(categoryId: string | number): Promise<{ id: number; name: string }> {
    const cmsCategory = await cmsApiClient.fetchCategory(categoryId);
    const cmsCategoryId = typeof cmsCategory.id === 'string' ? parseInt(cmsCategory.id, 10) : cmsCategory.id;

    const categoryData = {
      cmsCategoryId,
      name: cmsCategory.name,
      slug: this.slugify(cmsCategory.name),
    };

    const result = await db
      .insert(articleCategories)
      .values(categoryData)
      .onConflictDoUpdate({
        target: articleCategories.cmsCategoryId,
        set: categoryData,
      })
      .returning({ id: articleCategories.id, name: articleCategories.name });

    if (!result.length) {
      throw new Error(`Failed to sync category: ${categoryId}`);
    }

    return result[0];
  }

  static async deleteArticle(articleId: string | number): Promise<void> {
    const cmsArticleId = typeof articleId === 'string' ? parseInt(articleId, 10) : articleId;
    
    const result = await db
      .update(articles)
      .set({ deletedAt: new Date() })
      .where(eq(articles.cmsArticleId, cmsArticleId))
      .returning({ id: articles.id });

    if (!result.length) {
      console.warn(`[CMS Sync] Article not found for deletion: ${articleId}`);
    }
  }

  private static extractImageUrl(image: unknown): string | null {
    if (!image) return null;
    if (typeof image === 'string') return image;
    if (typeof image === 'object' && image !== null && 'url' in image) {
      return (image as { url: string }).url;
    }
    return null;
  }

  private static slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

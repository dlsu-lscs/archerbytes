import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { ArticleService } from '@/features/article/services/service';
import { articleSlugParamSchema } from '@/features/article/types';
import { fail, ok } from '@/lib/api/response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const parsedParams = articleSlugParamSchema.parse(await params);
    const status = req.nextUrl.searchParams.get('status') ?? undefined;

    const article = await ArticleService.getBySlug(
      parsedParams.slug,
      status === 'draft' || status === 'published' ? status : undefined,
    );

    if (!article) {
      return fail('Article not found', 404);
    }

    return ok(article);
  } catch (error) {
    console.error('Error fetching article by slug:', error);

    if (error instanceof ZodError) {
      return fail('Validation failed', 400, error.issues);
    }

    return fail('Failed to fetch article', 500);
  }
}

import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { ArticleService, CategoryService } from '@/features/article/services/service';
import { categoryArticlesQuerySchema, idParamSchema } from '@/features/article/types';
import { buildPaginationMeta, fail, okPaginated } from '@/lib/api/response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const parsedParams = idParamSchema.parse(await params);
    const page = req.nextUrl.searchParams.get('page') ?? undefined;
    const limit = req.nextUrl.searchParams.get('limit') ?? undefined;

    const query = categoryArticlesQuerySchema.parse({ page, limit });

    const category = await CategoryService.getById(parsedParams.id);
    if (!category) {
      return fail('Category not found', 404);
    }

    const result = await CategoryService.listArticles(parsedParams.id, query);
    const meta = buildPaginationMeta(result.total, result.page, result.limit);

    return okPaginated(result.items, meta);
  } catch (error) {
    console.error('Error listing category articles:', error);

    if (error instanceof ZodError) {
      return fail('Validation failed', 400, error.issues);
    }

    return fail('Failed to list category articles', 500);
  }
}

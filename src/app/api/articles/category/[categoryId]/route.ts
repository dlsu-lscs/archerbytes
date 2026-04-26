import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { ArticleService, CategoryService } from '@/features/article/services/service';
import {
  articlesByCategoryQuerySchema,
  categoryIdParamSchema,
} from '@/features/article/types';
import { buildPaginationMeta, fail, okPaginated } from '@/lib/api/response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> },
) {
  try {
    const parsedParams = categoryIdParamSchema.parse(await params);
    const page = req.nextUrl.searchParams.get('page') ?? undefined;
    const limit = req.nextUrl.searchParams.get('limit') ?? undefined;
    const sort = req.nextUrl.searchParams.get('sort') ?? undefined;

    const query = articlesByCategoryQuerySchema.parse({ page, limit, sort });

    const category = await CategoryService.getById(parsedParams.categoryId);
    if (!category) {
      return fail('Category not found', 404);
    }

    const result = await ArticleService.listByCategoryId(parsedParams.categoryId, query);
    const meta = buildPaginationMeta(result.total, result.page, result.limit);

    return okPaginated(result.items, meta);
  } catch (error) {
    console.error('Error listing articles by category:', error);

    if (error instanceof ZodError) {
      return fail('Validation failed', 400, error.issues);
    }

    return fail('Failed to list articles by category', 500);
  }
}

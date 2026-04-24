import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { ArticleService } from '@/features/article/services/service';
import { articleListQuerySchema } from '@/features/article/types';
import { buildPaginationMeta, fail, okPaginated } from '@/lib/api/response';

export async function GET(req: NextRequest) {
  try {
    const page = req.nextUrl.searchParams.get('page') ?? undefined;
    const limit = req.nextUrl.searchParams.get('limit') ?? undefined;
    const category = req.nextUrl.searchParams.get('category') ?? undefined;
    const status = req.nextUrl.searchParams.get('status') ?? undefined;
    const sort = req.nextUrl.searchParams.get('sort') ?? undefined;

    const query = articleListQuerySchema.parse({
      page,
      limit,
      category,
      status,
      sort,
    });

    const result = await ArticleService.list(query);
    const meta = buildPaginationMeta(result.total, result.page, result.limit);

    return okPaginated(result.items, meta);
  } catch (error) {
    console.error('Error listing articles:', error);

    if (error instanceof ZodError) {
      return fail('Validation failed', 400, error.issues);
    }

    return fail('Failed to list articles', 500);
  }
}

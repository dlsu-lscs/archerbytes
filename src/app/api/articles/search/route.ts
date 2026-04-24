import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { ArticleService } from '@/features/article/services/service';
import { articleSearchQuerySchema } from '@/features/article/types';
import { buildPaginationMeta, fail, okPaginated } from '@/lib/api/response';

export async function GET(req: NextRequest) {
  try {
    const page = req.nextUrl.searchParams.get('page') ?? undefined;
    const limit = req.nextUrl.searchParams.get('limit') ?? undefined;
    const q = req.nextUrl.searchParams.get('q') ?? undefined;

    const query = articleSearchQuerySchema.parse({ page, limit, q });
    const result = await ArticleService.search(query);
    const meta = buildPaginationMeta(result.total, result.page, result.limit);

    return okPaginated(result.items, meta);
  } catch (error) {
    console.error('Error searching articles:', error);

    if (error instanceof ZodError) {
      return fail('Validation failed', 400, error.issues);
    }

    return fail('Failed to search articles', 500);
  }
}

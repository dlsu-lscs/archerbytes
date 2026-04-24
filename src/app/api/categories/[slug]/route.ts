import { ZodError } from 'zod';
import { fail, ok } from '@/lib/api/response';
import { CategoryService } from '@/features/article/services/service';
import { categorySlugParamSchema } from '@/features/article/types';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const parsedParams = categorySlugParamSchema.parse(await params);
    const category = await CategoryService.getBySlug(parsedParams.slug);

    if (!category) {
      return fail('Category not found', 404);
    }

    return ok(category);
  } catch (error) {
    console.error('Error fetching category by slug:', error);

    if (error instanceof ZodError) {
      return fail('Validation failed', 400, error.issues);
    }

    return fail('Failed to fetch category', 500);
  }
}

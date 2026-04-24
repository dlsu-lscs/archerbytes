import { fail, ok } from '@/lib/api/response';
import { CategoryService } from '@/features/article/services/service';

export async function GET() {
  try {
    const categories = await CategoryService.list();
    return ok(categories);
  } catch (error) {
    console.error('Error listing categories:', error);
    return fail('Failed to list categories', 500);
  }
}

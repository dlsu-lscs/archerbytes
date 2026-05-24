import { z } from 'zod';

import { requireAuth } from '@/lib/util/auth/session';
import { ok, fail } from '@/lib/api/response';
import { uploadProfileImage } from '@/lib/storage/s3';
import { updateUserProfile } from '@/features/auth/services/service';

const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

const occupationSchema = z.string().min(1);

export async function PATCH(request: Request) {
  try {
    const session = await requireAuth();

    const form = await request.formData();

    const occupationRaw = form.get('occupation');
    let occupation: string | undefined;

    if (occupationRaw !== null) {
      const occ = String(occupationRaw).trim();
      try {
        occupation = occupationSchema.parse(occ);
      } catch {
        return fail('Invalid occupation: must be a non-empty string', 400);
      }
    }

    const imageEntry = form.get('image');
    let imageUrl: string | undefined;

    if (imageEntry !== null) {
      const maybeFile = imageEntry as unknown as File;

      if (!maybeFile || typeof maybeFile?.name !== 'string' || typeof maybeFile?.size !== 'number') {
        return fail('Invalid file upload for image', 400);
      }

      if (!ALLOWED_MIME.includes(maybeFile.type)) {
        return fail('Invalid image type. Allowed: image/jpeg, image/png, image/webp', 400, {
          allowed: ALLOWED_MIME,
        });
      }

      if (maybeFile.size > MAX_IMAGE_BYTES) {
        return fail('Image exceeds maximum size of 2 MB', 400);
      }

      imageUrl = await uploadProfileImage(maybeFile, session.user.id);
    }

    const payload: { occupation?: string; image?: string } = {};
    if (occupation !== undefined) payload.occupation = occupation;
    if (imageUrl !== undefined) payload.image = imageUrl;

    if (Object.keys(payload).length === 0) {
      return fail('No updatable fields provided. Include `occupation` and/or `image`.', 400);
    }

    const updated = await updateUserProfile(session.user.id, payload);

    if (!updated) {
      return fail('Failed to update user profile', 500);
    }

    const resp = {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      image: updated.image,
      occupation: updated.occupation,
      updatedAt: updated.updatedAt,
    };

    return ok(resp);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return fail('Unauthorized', 401);
    }

    console.error('PATCH /api/user error:', err);
    return fail('Internal server error', 500);
  }
}

export const runtime = 'edge';

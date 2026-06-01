import { z } from 'zod';

import { requireAuth } from '@/lib/util/auth/session';
import { ok, fail } from '@/lib/api/response';
import { deleteProfileImage, uploadProfileImage } from '@/lib/storage/s3';
import { updateUserProfile } from '@/features/auth/services/service';
import type { UpdateUserProfileInput } from '@/features/auth/types';

const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

const occupationSchema = z.enum(['Alumni', 'Student', 'Faculty'] as const);
const bioSchema = z.string().max(150);

export async function PATCH(request: Request) {
  try {
    const session = await requireAuth();

    const form = await request.formData();

    const occupationRaw = form.get('occupation');
    let occupation: UpdateUserProfileInput['occupation'];

    if (occupationRaw !== null) {
      const occ = String(occupationRaw).trim();
      try {
        occupation = occupationSchema.parse(occ);
      } catch {
        return fail(
          'Invalid occupation: must be one of Alumni, Student, Faculty',
          400,
        );
      }
    }

    const bioRaw = form.get('bio');
    let bio: string | undefined;
    if (bioRaw !== null) {
      const b = String(bioRaw).trim();
      try {
        bio = bioSchema.parse(b);
      } catch {
        return fail('Invalid bio: must be at most 150 characters', 400);
      }
    }

    const imageEntry = form.get('image');
    let imageUrl: string | undefined;
    let uploadedObjectKey: string | null = null;

    if (imageEntry !== null) {
      if (!(imageEntry instanceof File)) {
        return fail('Invalid file upload for image', 400);
      }

      if (!ALLOWED_MIME.includes(imageEntry.type)) {
        return fail(
          'Invalid image type. Allowed: image/jpeg, image/png, image/webp',
          400,
          {
            allowed: ALLOWED_MIME,
          },
        );
      }

      if (imageEntry.size > MAX_IMAGE_BYTES) {
        return fail('Image exceeds maximum size of 2 MB', 400);
      }

      const uploadResult = await uploadProfileImage(
        imageEntry,
        session.user.id,
      );
      uploadedObjectKey = uploadResult.objectKey;
      imageUrl = uploadResult.imageUrl;
    }

    const payload: UpdateUserProfileInput = {};
    if (occupation !== undefined) payload.occupation = occupation;
    if (imageUrl !== undefined) payload.image = imageUrl;
    if (bio !== undefined) payload.bio = bio;

    if (Object.keys(payload).length === 0) {
      return fail(
        'No updatable fields provided. Include `occupation`, `bio`, and/or `image`.',
        400,
      );
    }

    const updated = await updateUserProfile(session.user.id, payload);

    if (!updated) {
      if (uploadedObjectKey) {
        try {
          await deleteProfileImage(uploadedObjectKey);
        } catch (cleanupError) {
          console.error(
            'Failed to clean up uploaded profile image after DB update failure:',
            cleanupError,
          );
        }
      }
      return fail('Failed to update user profile', 500);
    }

    const resp = {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      image: updated.image,
      occupation: updated.occupation,
      bio: updated.bio,
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

export const runtime = 'nodejs';

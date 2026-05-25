import { db } from '@/config/database';
import { user } from '@/lib/db/auth-schema';
import { eq } from 'drizzle-orm';
import type { UpdateUserProfileInput } from '@/features/auth/types';

export async function getUserById(userId: string) {
  try {
    const users = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    return users[0] ?? null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const users = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    return users[0] ?? null;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
}

export async function updateUserProfile(userId: string, data: UpdateUserProfileInput) {
  try {
    const setObj: Partial<typeof user.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (data.occupation !== undefined) {
      setObj.occupation = data.occupation;
    }

    if (data.image !== undefined) {
      setObj.image = data.image;
    }

    if (data.bio !== undefined) {
      setObj.bio = data.bio;
    }

    if (Object.keys(setObj).length === 1) {
      return null;
    }

    const updated = await db
      .update(user)
      .set(setObj)
      .where(eq(user.id, userId))
      .returning();

    return updated[0] ?? null;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
}

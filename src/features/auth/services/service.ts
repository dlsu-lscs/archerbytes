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
    type SetObj = Partial<{
      occupation: string | null;
      image: string | null;
      updatedAt: Date;
    }>;

    const setObj: SetObj = {};

    if (data.occupation !== undefined) setObj.occupation = data.occupation ?? null;
    if (data.image !== undefined) setObj.image = data.image ?? null;

    if (Object.keys(setObj).length === 0) {
      return null;
    }

    setObj.updatedAt = new Date();

    const updated = await db.update(user).set(setObj as Record<string, unknown>).where(eq(user.id, userId)).returning();

    return updated[0] ?? null;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
}

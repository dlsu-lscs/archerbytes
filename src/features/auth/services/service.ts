import { db } from '@/config/database';
import { user } from '@/lib/db/auth-schema';
import { eq } from 'drizzle-orm';

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

export async function updateUserName(userId: string, name: string) {
  try {
    const updated = await db
      .update(user)
      .set({
        name,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId))
      .returning();

    return updated[0] ?? null;
  } catch (error) {
    console.error('Error updating user name:', error);
    return null;
  }
}

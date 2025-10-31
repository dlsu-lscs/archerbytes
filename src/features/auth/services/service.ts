import { db } from '@/config/database';
import { user } from '@/lib/db/auth-schema';
import { eq } from 'drizzle-orm';

export class AuthService {
  static async getUserById(userId: string) {
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

  static async getUserByEmail(email: string) {
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

  static async updateUser(
    userId: string,
    data: { name?: string; image?: string },
  ) {
    try {
      const updated = await db
        .update(user)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(user.id, userId))
        .returning();

      return updated[0] ?? null;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }
}

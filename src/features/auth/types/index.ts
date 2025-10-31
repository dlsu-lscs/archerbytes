import { user, session, account, verification } from '@/lib/db/auth-schema';

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Account = typeof account.$inferSelect;
export type Verification = typeof verification.$inferSelect;

export interface AuthSession {
  session: Session;
  user: User;
}

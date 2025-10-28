import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  type AnyPgColumn,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  articleId: text('article_id').notNull(),
  // Deleting a parent comment will delete its replies
  replyTo: integer('reply_to').references((): AnyPgColumn => comments.id, {
    onDelete: 'cascade',
  }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
});

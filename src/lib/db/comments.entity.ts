import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  type AnyPgColumn,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { articles } from './article.entity';

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  articleId: integer('article_id')
    .notNull()
    .references(() => articles.id, {
      onDelete: 'cascade',
    }),
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

import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { user } from './auth-schema';
import { articles } from './article.entity';

export const bookmarks = pgTable(
  'bookmarks',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    articleId: integer('article_id')
      .notNull()
      .references(() => articles.id, { onDelete: 'cascade' }),
    bookmarkedAt: timestamp('bookmarked_at')
      .notNull()
      .default(sql`now()`),
    createdAt: timestamp('created_at')
      .notNull()
      .default(sql`now()`),
  },
  (table) => [
    unique('bookmarks_user_article_unique').on(table.userId, table.articleId),
    index('bookmarks_user_article_idx').on(table.userId, table.articleId),
  ],
);
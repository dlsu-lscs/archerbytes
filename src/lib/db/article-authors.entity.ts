import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { articles } from './article.entity';

export const articleAuthors = pgTable('article_authors', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  bio: text('bio'),
  avatarUrl: varchar('avatar_url', { length: 1000 }),
  userId: integer('user_id'), // optional link to actual user account
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const articleAuthorsRelations = relations(
  articleAuthors,
  ({ many }) => ({
    articles: many(articles),
  }),
);

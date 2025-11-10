import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { articleCategories } from './article-categories.entity';
import { articleAuthors } from './article-authors.entity';

export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),

  title: varchar('title', { length: 500 }).notNull(),
  subtitle: varchar('subtitle', { length: 500 }).notNull(),
  slug: varchar('slug', { length: 500 }).notNull().unique(),
  content: jsonb('content').notNull(),
  categoryId: integer('category_id')
    .notNull()
    .references(() => articleCategories.id, {
      onDelete: 'restrict', // Changed to 'restrict'
    }),
  authorId: integer('author_id')
    .notNull()
    .references(() => articleAuthors.id, { onDelete: 'restrict' }),
  featuredImageUrl: varchar('featured_image_url', { length: 1000 }),
  tags: text('tags').array(),
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: varchar('meta_description', { length: 500 }),
  metaImageUrl: varchar('meta_image_url', { length: 1000 }),
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const articlesRelations = relations(articles, ({ one }) => ({
  category: one(articleCategories, {
    fields: [articles.categoryId],
    references: [articleCategories.id],
  }),
  author: one(articleAuthors, {
    fields: [articles.authorId],
    references: [articleAuthors.id],
  }),
}));

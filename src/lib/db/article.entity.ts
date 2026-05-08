import {
  index,
  pgEnum,
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { articleCategories } from './article-categories.entity';
import { user } from './auth-schema';

export const articleStatusEnum = pgEnum('article_status', [
  'draft',
  'published',
]);

export const articles = pgTable(
  'articles',
  {
    id: serial('id').primaryKey(),
    cmsArticleId: integer('cms_article_id').unique(),
    title: varchar('title', { length: 500 }).notNull(),
    subtitle: varchar('subtitle', { length: 500 }).notNull(),
    slug: varchar('slug', { length: 500 }).notNull().unique(),
    content: text('content').notNull(),
    categoryId: integer('category_id')
      .notNull()
      .references(() => articleCategories.id, {
        onDelete: 'restrict',
      }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'restrict' }),
    featuredImageUrl: varchar('featured_image_url', { length: 1000 }),
    tags: text('tags').array(),
    metaTitle: varchar('meta_title', { length: 255 }),
    metaDescription: varchar('meta_description', { length: 500 }),
    metaImageUrl: varchar('meta_image_url', { length: 1000 }),
    status: articleStatusEnum('status').notNull().default('draft'),
    publishedAt: timestamp('published_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    index('articles_cms_article_id_idx').on(table.cmsArticleId),
    index('articles_status_idx').on(table.status),
    index('articles_published_at_idx').on(table.publishedAt.desc()),
    index('articles_category_id_idx').on(table.categoryId),
    index('articles_status_published_at_idx').on(
      table.status,
      table.publishedAt.desc(),
    ),
    index('articles_deleted_at_idx').on(table.deletedAt),
  ],
);

export const articlesRelations = relations(articles, ({ one }) => ({
  category: one(articleCategories, {
    fields: [articles.categoryId],
    references: [articleCategories.id],
  }),
  user: one(user, {
    fields: [articles.userId],
    references: [user.id],
  }),
}));

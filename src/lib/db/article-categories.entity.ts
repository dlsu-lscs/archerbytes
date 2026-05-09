import { pgTable, serial, varchar, text, timestamp, integer, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { articles } from './article.entity';

export const articleCategories = pgTable('article_categories', {
  id: serial('id').primaryKey(),
  cmsCategoryId: integer('cms_category_id').unique(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => [
  index('article_categories_cms_category_id_idx').on(table.cmsCategoryId),
  index('article_categories_deleted_at_idx').on(table.deletedAt),
]);

export const articleCategoriesRelations = relations(
  articleCategories,
  ({ many }) => ({
    articles: many(articles),
  }),
);

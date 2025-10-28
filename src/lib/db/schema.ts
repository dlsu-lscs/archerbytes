import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  unique,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  articleId: text('article_id').notNull(),
  // Deleting a parent comment will delete its replies
  replyTo: integer('reply_to').references((): any => comments.id, {
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

export const articleReactions = pgTable(
  'article_reactions',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull(),
    articleId: text('article_id').notNull(),
    reactionType: text('reaction_type').notNull(),
    createdAt: timestamp('created_at')
      .notNull()
      .default(sql`now()`),
  },
  (table) => ({
    // Prevents the same user from having multiple reactions on the same article
    uniqueUserArticle: unique().on(table.userId, table.articleId),
  }),
);

export const commentReactions = pgTable(
  'comment_reactions',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull(),
    commentId: integer('comment_id')
      .notNull()
      .references(() => comments.id, { onDelete: 'cascade' }),
    reactionType: text('reaction_type').notNull(),
    createdAt: timestamp('created_at')
      .notNull()
      .default(sql`now()`),
  },
  (table) => ({
    // Prevents the same user from having multiple reactions on the same comment
    uniqueUserComment: unique().on(table.userId, table.commentId),
  }),
);

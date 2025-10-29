import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  unique,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { comments } from './comments.entity';

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
  (t) => [unique('unique_user_article').on(t.userId, t.articleId)],
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
  (t) => [unique('unique_user_comment').on(t.userId, t.commentId)],
);

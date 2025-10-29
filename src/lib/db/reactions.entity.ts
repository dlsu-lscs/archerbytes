import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  unique,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { comments } from './comments.entity';

export const reactionTypeEnum = pgEnum('reaction_type', [
  'like',
  'heart',
  'care',
  'haha',
  'wow',
  'sad',
  'angry',
]);

export const articleReactions = pgTable(
  'article_reactions',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull(),
    articleId: text('article_id').notNull(),
    reactionType: reactionTypeEnum('reaction_type').notNull(),
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
    reactionType: reactionTypeEnum('reaction_type').notNull(),
    createdAt: timestamp('created_at')
      .notNull()
      .default(sql`now()`),
  },
  (t) => [unique('unique_user_comment').on(t.userId, t.commentId)],
);

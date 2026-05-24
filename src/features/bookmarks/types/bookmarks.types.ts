import { FeedArticleType } from "@/features/article/types/article.types";

export type BookmarkType = {
  id: number;
  userId: string;
  articleId: number;
  bookmarkedAt: Date;
  createdAt: Date;
  article: FeedArticleType;
}

export type BookmarkMetaType = {
  total: number;
  page: number;
  limit: number;
  pages: number;
}
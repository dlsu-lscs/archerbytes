export type BookmarkArticleType = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
}

export type BookmarkType = {
  id: number;
  userId: string;
  articleId: number;
  bookmarkedAt: Date;
  createdAt: Date;
  article: BookmarkArticleType;
}

export type BookmarkMetaType = {
  total: number;
  page: number;
  limit: number;
  pages: number;
}
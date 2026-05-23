export type ArticleDetailsType = {
    id: number;
    title: string;
    subtitle: string;
    slug: string;
    content: string;
    categoryId: number;
    userId: string;
    featuredImageUrl: string | null;
    tags: string[];
    keywords: string[];
    metaTitle: string | null;
    metaDescription: string | null;
    metaImageUrl: string | null;
    status: 'draft' | 'published';
    isEdited: boolean;
    publishedAt: Date | null;
    publicationDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
    author: string;
    avatarURL: string | null;
    occupation: string | null;
    readingTime: number;
    quote?: string;
    quotee?: string;
    commentCount: number;
    reactionCount: number;
    likeCount: number;
    previewURL: string;
};

export type articleAuthorType = {
    id: string;
    name: string;
    avatarURL: string | null;
    occupation: string | null;
}

export type articleCategoryType = {
    id: number;
    name: string;
    slug: string;
}

export type FeedArticleType = {
    id: number;
    title: string;
    subtitle: string;
    slug: string;
    featuredImageUrl: string | null;
    status: 'draft' | 'published';
    isEdited: boolean;
    publishedAt: Date;
    createdAt: Date;
    author: articleAuthorType,
    category: articleCategoryType,
    reactionCount: number;
    commentCount: number;
}

export type ArticleDetailsProp = {
    article: FeedArticleType;
};

export type FeedArticleProp = {
    article: FeedArticleType;
};

export type BreadcrumbsType = {
    link: string;
};

export type SmallArticleItemType = {
    topic: string;
    title: string;
    author: string;
    date: string;
};

export type IconsType = {
    date: Date;
    reactions: number;
    comments: number;
    likes?: number;
};

export type CategoryType = {
    id: number;
    name: string;
    slug: string;
    description: string;
    createdAt: Date;
    articleCount: number;
}

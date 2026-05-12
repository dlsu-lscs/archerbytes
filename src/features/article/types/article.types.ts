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
    metaTitle: string | null;
    metaDescription: string | null;
    metaImageUrl: string | null;
    status: 'draft' | 'published';
    isEdited: boolean;
    publishedAt: Date | null;
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
    previewURL: string;
};
export type ArticleDetailsProp = {
    article: ArticleDetailsType;
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
};

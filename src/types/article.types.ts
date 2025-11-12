export type ArticleDetailsType = {
    title: string;
    quote: string;
    quotee: string;
    author: string;
    avatarURL: string;
    occupation: string;
    readingTime: number;
    publicationDate: Date;
    commentCount: number;
    likeCount: number;
};
export type ArticleDetailsProp = {
    article: ArticleDetailsType;
};

export type BreadcrumbsType = {
    link: string;
};

export type KeywordsType = {
    keywords: string[];
};

export type SmallArticleItemType = {
    topic: string;
    title: string;
    author: string;
    date: string;
};

export type IconsType = {
    date: Date;
    likes: number;
    comments: number;
};

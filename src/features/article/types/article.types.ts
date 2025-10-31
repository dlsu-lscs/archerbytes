export type ArticleDetailsType = {
    title: string;
    quote: string;
    quotee: string;
    author: string;
    occupation: string;
    readingTime: number;
    publicationDate: Date;
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
};

export type TopicProps = {
    topic: string;
};

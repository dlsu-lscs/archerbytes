export type CommentType = {
    id?: number;
    articleId: number;
    userId: number;
    replyTo?: number | null;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    avatarURL?: string;
    occupation?: string;
    isAuthor?: boolean;
    reactionCount: number;
    replyCount: number;
};

export type CommentProp = {
    comment: CommentType;
    children?: React.ReactNode;
    isDraft?: boolean;
};

export type CommentType = {
    id?: number;
    articleId: number;
    replyTo?: number | null;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        name?: string;
        avatarURL?: string;
        occupation?: string | null;
    };
    isAuthor?: boolean;
    reactionCount: number;
    replyCount: number;
};

export type CommentProp = {
    comment: CommentType;
    children?: React.ReactNode;
    isDraft?: boolean;
};

export type CommentType = {
    id: number;
    avatarURL: string;
    userId: string;
    occupation: string;
    isAuthor: boolean;
    content: string;
    likeCount: number;
    replyCount: number;
    repliesTo: number;
};

export type CommentProp = {
    comment: CommentType;
    children: React.ReactNode;
    isDraft: boolean;
};

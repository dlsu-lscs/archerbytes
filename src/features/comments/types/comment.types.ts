export type CommentRecord = {
  id: number;
  userId: string;
  articleId: string;
  replyTo: number | null;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type GetCommentsResponse = {
  data: CommentRecord[];
};

export type CommentType = {
  id?: number;
  articleId: number;
  replyTo?: number | null;
  content: string;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    avatarURL: string | null;
    occupation: string | null;
  };
  isAuthor?: boolean;
  reactionCount: number;
  replyCount: number;
};

export type CommentProp = {
  comment?: CommentType;
  replies?: CommentProp[];
  isDraft?: boolean;
  articleId?: number;
};

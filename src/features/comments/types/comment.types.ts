import type { ReactionType } from '@/features/reactions/types';

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

export type CommentReactionSummary = {
  total: number;
  counts: Partial<Record<ReactionType, number>>;
  topTypes: ReactionType[];
  userReaction: ReactionType | null;
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
    email: string | null;
  };
  isAuthor?: boolean;
  reactionCount: number;
  reactionSummary?: CommentReactionSummary;
  replyCount: number;
};

export type CommentProp = {
  comment?: CommentType;
  replies?: CommentProp[];
  isDraft?: boolean;
  articleId?: number;
};

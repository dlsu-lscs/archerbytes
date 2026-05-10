'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import Image from 'next/image';

import clsx from 'clsx';

import { BsThreeDots } from 'react-icons/bs';
import { BiLike } from 'react-icons/bi';
import { FaRegCommentAlt } from 'react-icons/fa';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

import { CommentType } from '../../types/comment.types';
import { useAuthStore } from '@/store/use-auth-store';
import { useGetReplies } from '../../hooks/useGetReplies';
import { useUpdateComment } from '../../hooks/useUpdateComment';
import { useDeleteComment } from '../../hooks/useDeleteComment';
import CommentForm from './CommentForm';

interface CommentItemProps {
  comment: CommentType;
  articleId: number;
}

export default function CommentItem({ comment, articleId }: CommentItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const user = useAuthStore((state) => state.user);
  const isOwner = user?.id === comment.user.id;
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();

  const replyTargetId =
    typeof comment.id === 'number' ? (comment.replyTo ?? comment.id) : null;

  const { data: fetchedReplies, isLoading } = useGetReplies(comment.id ?? 0, {
    enabled: isExpanded && Boolean(comment.id),
  });

  const hasReplies = (comment.replyCount ?? 0) > 0;

  const handleSaveEdit = () => {
    if (!comment.id || !user) return;

    const nextContent = editedContent.trim();
    if (!nextContent || nextContent === comment.content) {
      setIsEditing(false);
      setEditedContent(comment.content);
      return;
    }

    updateComment.mutate(
      {
        commentId: comment.id,
        userId: user.id,
        articleId,
        replyTo: comment.replyTo ?? null,
        data: { content: nextContent },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  const handleDelete = () => {
    if (!comment.id || !user) return;

    deleteComment.mutate(
      {
        commentId: comment.id,
        userId: user.id,
        articleId,
        replyTo: comment.replyTo ?? null,
      },
      {
        onSuccess: () => {
          setIsDeleteConfirmOpen(false);
          setIsActionsOpen(false);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-[10px]">
      <Card
        className={clsx({
          'bg-blue-300': comment?.isAuthor === true,
        })}
      >
        <CardContent className="flex rounded-2xl relative">
          <div
            className={clsx(
              'absolute md:left-[47px] left-[40px] md:top-[51px] top-[35px] h-full w-[2px] bg-neutral-300',
              { hidden: !hasReplies || !isExpanded },
            )}
          ></div>

          <Image
            className="size-8 md:size-12 my-[3px] shrink-0 rounded-full mr-3 z-30"
            height={128}
            width={128}
            src={comment?.user?.avatarURL ?? ''}
            alt="Avatar"
          />
          <div className="flex flex-col gap-[15px] w-full">
            <div className="flex justify-between">
              <div>
                <h3 className="text-md font-bold">{comment?.user?.name}</h3>
                {comment?.isAuthor === true ? (
                  <p className="text-sm font-light">
                    Author - {comment?.user?.email?.split('@')?.[0] ?? 'User'}
                  </p>
                ) : (
                  <p className="text-sm font-light">
                    {comment?.user?.email?.split('@')?.[0] ?? 'User'}
                  </p>
                )}
              </div>
              {isOwner && (
                <Popover open={isActionsOpen} onOpenChange={setIsActionsOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="p-1 text-neutral-600 hover:text-neutral-900"
                      aria-label="Open comment actions"
                    >
                      <BsThreeDots size={22} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-40 p-1">
                    <div className="flex flex-col">
                      <Button
                        variant="ghost"
                        className="justify-start"
                        onClick={() => {
                          setIsEditing(true);
                          setIsDeleteConfirmOpen(false);
                          setIsReplying(false);
                          setEditedContent(comment.content);
                          setIsActionsOpen(false);
                        }}
                      >
                        Update
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start text-red-600 hover:text-red-700"
                        onClick={() => {
                          setIsDeleteConfirmOpen(true);
                          setIsEditing(false);
                          setIsActionsOpen(false);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>

            {isEditing ? (
              <div className="flex flex-col gap-2">
                <Textarea
                  className="resize-none min-h-24"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedContent(comment.content);
                    }}
                    disabled={updateComment.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    disabled={updateComment.isPending || !editedContent.trim()}
                  >
                    {updateComment.isPending ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm">{comment.content}</div>
            )}

            {isDeleteConfirmOpen && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-700">Delete this comment?</p>
                <div className="mt-2 flex justify-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setIsDeleteConfirmOpen(false)}
                    disabled={deleteComment.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleteComment.isPending}
                  >
                    {deleteComment.isPending ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            )}

            <div className="flex gap-5">
              <div className="flex gap-2 items-center">
                <BiLike size={16} />
                <p>{comment.reactionCount}</p>
              </div>
              <div className="flex gap-2 items-center">
                <FaRegCommentAlt size={16} />
                <p>{comment.replyCount}</p>
              </div>
              {hasReplies && (
                <button
                  className="flex gap-2 items-center text-sm text-neutral-600 hover:text-neutral-900"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <>
                      <FaChevronUp size={12} />
                      <span>Hide replies</span>
                    </>
                  ) : (
                    <>
                      <FaChevronDown size={12} />
                      <span>View replies</span>
                    </>
                  )}
                </button>
              )}
              <button
                className="flex gap-2 items-center text-sm text-neutral-600 hover:text-neutral-900"
                onClick={() => setIsReplying(!isReplying)}
              >
                <FaRegCommentAlt size={12} />
                <span>Reply</span>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
      {isReplying && (
        <div className="md:mt-2 md:py-2 pb-3">
          {comment.replyTo !== null && (
            <div className="absolute md:-left-[16px] left-[9px] md:-top-3 md:bottom-0 bottom-16 h-full w-[2px] bg-neutral-300" />
          )}
          <div className="relative">
            {comment.replyTo !== null && (
              <>
                <div className="absolute md:-left-[16px] left-[9px] md:-bottom-2 bottom-12 w-[2px] md:h-[calc(100%_-_30px)] h-[calc(100%_-_40px)] bg-neutral-50 z-10" />
                <div className="absolute md:-left-[16px] left-[9px] -top-3 md:w-13 w-5 md:h-16 h-15 border-b-2 border-l-2 border-neutral-300 rounded-bl-2xl z-20" />
              </>
            )}
            <CommentForm
              articleId={articleId}
              replyTo={replyTargetId}
              placeholder="Write your reply..."
              buttonText="Reply"
              onSuccess={() => setIsReplying(false)}
            />
            <Button
              className="mt-2 px-4 py-1 text-sm bg-neutral-400 z-30"
              onClick={() => setIsReplying(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      {isExpanded &&
        !isLoading &&
        fetchedReplies &&
        fetchedReplies.map((reply, index) => {
          const count = fetchedReplies.length;
          const isLast = index === count - 1;

          return (
            <div className="relative md:ml-16 ml-8" key={reply.id}>
              {!isLast && (
                <div className="absolute md:-left-[16px] left-[9px] -top-3 bottom-0 w-[2px] bg-neutral-300" />
              )}
              <div className="absolute md:-left-[16px] left-[9px] md:w-13 w-5 h-16 md:-top-3 -top-5 bottom-0 border-b-2 border-l-2 border-neutral-300 rounded-bl-2xl" />
              <CommentItem comment={reply} articleId={articleId} />
            </div>
          );
        })}
      {isLoading && isExpanded && (
        <div className="ml-12 mt-4 text-sm text-neutral-500">
          Loading replies...
        </div>
      )}
    </div>
  );
}

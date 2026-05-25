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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import Image from 'next/image';

import clsx from 'clsx';

import { BsThreeDots } from 'react-icons/bs';
import { FaRegCommentAlt } from 'react-icons/fa';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useSession } from '@/lib/auth/client';

import { CommentType } from '../../types/comment.types';
import { useGetReplies } from '../../hooks/useGetReplies';
import { useCommentDeleteAction, useCommentUpdateAction } from '../../hooks';
import { useReplyToggle } from '../../hooks';
import CommentForm from './CommentForm';
import CommentReactionPopover from '@/features/reactions/components/molecule/CommentReactionPopover';

interface CommentItemProps {
  comment: CommentType;
  articleId: number;
}

export default function CommentItem({ comment, articleId }: CommentItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const { data: session } = useSession();
  const user = session?.user;
  const { isReplying, setIsReplying, toggleReply } = useReplyToggle();
  const isOwner = user?.id === comment.user.id;
  const { saveCommentEdit, isPending: isUpdatePending } =
    useCommentUpdateAction({
      commentId: comment.id,
      articleId,
      replyTo: comment.replyTo ?? null,
      originalContent: comment.content,
      onSuccess: () => setIsEditing(false),
    });
  const { deleteComment: deleteCommentAction, isPending: isDeletePending } =
    useCommentDeleteAction({
      commentId: comment.id,
      articleId,
      replyTo: comment.replyTo ?? null,
      onSuccess: () => {
        setIsDeleteConfirmOpen(false);
        setIsActionsOpen(false);
      },
    });

  const replyTargetId =
    typeof comment.id === 'number' ? (comment.replyTo ?? comment.id) : null;

  const {
    data: fetchedReplies,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    sentinelRef: repliesSentinelRef,
  } = useGetReplies(comment.id ?? 0, {
    enabled: isExpanded && Boolean(comment.id),
    isExpanded,
  });

  const replyCount = comment.replyCount ?? 0;
  const hasReplies = replyCount > 0;

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
            src={comment?.user?.avatarURL || '/globe.svg'}
            alt="Avatar"
          />
          <div className="flex flex-col gap-[15px] w-full min-w-0">
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
                    disabled={isUpdatePending}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => saveCommentEdit(editedContent)}
                    disabled={isUpdatePending || !editedContent.trim()}
                  >
                    {isUpdatePending ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm break-words">{comment.content}</div>
            )}

            <Dialog
              open={isDeleteConfirmOpen}
              onOpenChange={setIsDeleteConfirmOpen}
            >
              <DialogContent showCloseButton={false} className="border-0">
                <DialogHeader>
                  <DialogTitle className="text-neutral-50">
                    Delete comment?
                  </DialogTitle>
                  <DialogDescription className="text-neutral-400">
                    This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="secondary"
                    onClick={() => setIsDeleteConfirmOpen(false)}
                    disabled={isDeletePending}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={deleteCommentAction}
                    disabled={isDeletePending}
                  >
                    {isDeletePending ? 'Deleting...' : 'Delete'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="flex gap-5 flex-wrap">
              <CommentReactionPopover
                commentId={comment.id}
                articleId={articleId}
                replyTo={comment.replyTo ?? null}
                fallbackCount={comment.reactionCount}
              />
              {hasReplies && (
                <button
                  className="flex gap-2 items-center text-sm text-neutral-600 hover:text-neutral-900"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <>
                      <FaChevronUp size={12} />
                      <span>Hide replies ({replyCount})</span>
                    </>
                  ) : (
                    <>
                      <FaChevronDown size={12} />
                      <span>View replies ({replyCount})</span>
                    </>
                  )}
                </button>
              )}
              <button
                className="flex gap-2 items-center text-sm text-neutral-600 hover:text-neutral-900"
                onClick={toggleReply}
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
      {isExpanded && (
        <>
          {isLoading && (
            <div className="ml-12 mt-4 text-sm text-neutral-500">
              Loading replies...
            </div>
          )}
          {!isLoading &&
            fetchedReplies.map((reply, index) => {
              const isLast =
                index === fetchedReplies.length - 1 && !hasNextPage;

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
          <div
            ref={repliesSentinelRef}
            className="ml-12 py-1 text-center text-sm text-neutral-400"
          >
            {isFetchingNextPage ? 'Loading more replies...' : ''}
          </div>
        </>
      )}
    </div>
  );
}

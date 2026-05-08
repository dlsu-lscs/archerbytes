'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

import Image from 'next/image';

import clsx from 'clsx';

import { BsThreeDots } from 'react-icons/bs';
import { BiLike } from 'react-icons/bi';
import { FaRegCommentAlt } from 'react-icons/fa';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

import { CommentProp } from '../../types/comment.types';
import { useGetReplies } from '../../hooks/useGetReplies';

export default function Comment({ comment, isDraft = false }: CommentProp) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { data: fetchedReplies, isLoading } = useGetReplies(comment?.id!, {
        enabled: isExpanded,
    });

    const hasReplies = (comment?.replyCount ?? 0) > 0;

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
                            `absolute md:left-[47px] left-[40px] md:top-[51px] top-[35px] h-full w-[2px] bg-neutral-300`,
                            { hidden: !hasReplies || !isExpanded },
                        )}
                    ></div>

                    <Image
                        className="size-8 md:size-12 my-[3px] shrink-0 rounded-full mr-3"
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
                            <BsThreeDots size={24} />
                        </div>
                        {isDraft === true ? (
                            <Textarea
                                className="resize-none min-h-6 py-6 px-5 rounded-sm"
                                placeholder="Share your thoughts here..."
                            />
                        ) : (
                            <div className="text-sm">{comment?.content}</div>
                        )}

                        {isDraft === true ? (
                            <Button className="px-10 w-fit">Reply</Button>
                        ) : (
                            <div className="flex gap-5">
                                <div className="flex gap-2 items-center">
                                    <BiLike size={16} />
                                    <p>{comment?.reactionCount}</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <FaRegCommentAlt size={16} />
                                    <p>{comment?.replyCount}</p>
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
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
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
                            <Comment comment={reply} />
                        </div>
                    );
                })}
            {isLoading && isExpanded && (
                <div className="ml-12 mt-4 text-sm text-neutral-500">Loading replies...</div>
            )}
        </div>
    );
}

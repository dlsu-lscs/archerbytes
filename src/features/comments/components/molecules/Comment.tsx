import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

import Image from 'next/image';

import React from 'react';
import clsx from 'clsx';

import { BsThreeDots } from 'react-icons/bs';
import { BiLike } from 'react-icons/bi';
import { FaRegCommentAlt } from 'react-icons/fa';

import { CommentProp } from '../../types/comment.types';

export default function Comment({
    comment,
    children,
    isDraft = false,
}: CommentProp) {
    const hasReplies = !!children;

    return (
        <div className="flex flex-col gap-[10px]">
            <Card
                className={clsx({
                    'bg-blue-300': comment.isAuthor === true,
                })}
            >
                <CardContent className="flex rounded-2xl relative">
                    <div
                        className={clsx(
                            `absolute left-[47px] top-[51px] h-full w-[2px] bg-neutral-300`,
                            { hidden: !hasReplies },
                        )}
                    ></div>

                    <Image
                        className="size-12 my-[3px] shrink-0 rounded-full mr-3"
                        height={128}
                        width={128}
                        src={comment.avatarURL}
                        alt="Avatar"
                    />
                    <div className="flex flex-col gap-[15px] w-full">
                        <div className="flex justify-between">
                            <div>
                                <h3 className="text-md font-bold">{comment.userId}</h3>
                                {comment.isAuthor === true ? (
                                    <p className="text-sm font-light">
                                        Author - {comment.occupation}
                                    </p>
                                ) : (
                                    <p className="text-sm font-light">{comment.occupation}</p>
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
                            <div className="text-sm">{comment.content}</div>
                        )}

                        {isDraft === true ? (
                            <Button className="px-10 w-fit">Reply</Button>
                        ) : (
                            <div className="flex gap-5">
                                <div className="flex gap-2 items-center">
                                    <BiLike size={16} />
                                    <p>{comment.likeCount}</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <FaRegCommentAlt size={16} />
                                    <p>{comment.replyCount}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
            {/* this function draws lines */}
            {hasReplies ? (
                React.Children.map(children, (child, index) => {
                    const count = React.Children.count(children);
                    const isLast = index === count - 1;

                    return (
                        <div className="relative ml-16" key={index}>
                            {!isLast && (
                                <div className="absolute -left-[16px] -top-3 bottom-0 w-[2px] bg-neutral-300" />
                            )}{' '}
                            <div className="absolute -left-[16px] w-13 h-16 -top-3 bottom-0 border-b-2 border-l-2 border-neutral-300 rounded-bl-2xl" />
                            {child}
                        </div>
                    );
                })
            ) : (
                <></>
            )}
        </div>
    );
}

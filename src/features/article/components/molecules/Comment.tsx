import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { BsThreeDots } from 'react-icons/bs';
import { BiLike } from 'react-icons/bi';
import { FaRegCommentAlt } from 'react-icons/fa';

type CommentType = {
    id: number;
    avatarURL: string;
    userId: string;
    occupation: string;
    isAuthor: boolean;
    content: string;
    likeCount: number;
    replyCount: number;
    repliesTo: CommentType;
};

export default function Comment({ comment }: CommentType) {
    return (
        <Card>
            <CardContent className="flex rounded-2xl">
                <div className="size-12 my-[3px] shrink-0 rounded-full bg-neutral-400 mr-3"></div>
                <div className="flex flex-col gap-[15px] w-full">
                    <div className="flex justify-between">
                        <div>
                            <h3 className="text-lg font-bold">{comment.userId}</h3>
                            <p className="text-md font-light">{comment.occupation}</p>
                        </div>
                        <BsThreeDots size={24} />
                    </div>
                    <div>{comment.content}</div>
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
                </div>
            </CardContent>
        </Card>
    );
}

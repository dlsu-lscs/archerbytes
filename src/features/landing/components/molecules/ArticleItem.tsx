import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { LuCircleMinus } from 'react-icons/lu';
import { FaRegBookmark } from 'react-icons/fa6';

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import IconGroup from '../atoms/IconGroup';

import Image from 'next/image';

import { ArticleDetailsProp } from '@/types/article.types';

export default function ArticleItem({ article }: ArticleDetailsProp) {
    return (
        <Card className="flex flex-col px-8 py-10 gap-0 border-0 shadow-none rounded-none border-b-2 border-solid">
            <div className="flex justify-end items-center gap-1">
                <LuCircleMinus />
                <FaRegBookmark />
                <HiOutlineDotsHorizontal />
            </div>
            <div className="flex justify-between items-center gap-12">
                <CardContent className="flex flex-col gap-2 p-0">
                    <div className="flex gap-2 items-center">
                        <Image
                            className="size-4 shrink-0 rounded-full"
                            height={128}
                            width={128}
                            src={article.avatarURL}
                            alt="Avatar"
                        />
                        <p className="font-light">{article.author}</p>
                    </div>
                    <div>
                        <h5 className="font-bold">{article.title}</h5>
                        <p className="text-sm">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse
                            incidunt aspernatur deserunt voluptas aut eaque corporis labore a
                            fugiat inventore ratione consectetur, obcaecati rerum quas
                            laudantium aperiam, fuga molestiae nemo!
                        </p>
                    </div>
                    <IconGroup
                        date={article.publicationDate}
                        likes={article.likeCount}
                        comments={article.commentCount}
                    />
                </CardContent>
                <Image
                    className="w-48 aspect-video shrink-0 rounded-xl"
                    height={480}
                    width={854}
                    src={'/image.jpg'}
                    alt="Avatar"
                />
            </div>
        </Card>
    );
}

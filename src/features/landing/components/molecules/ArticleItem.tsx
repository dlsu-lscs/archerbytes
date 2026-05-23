import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { LuCircleMinus } from 'react-icons/lu';
import { FaRegBookmark } from 'react-icons/fa6';

import {
    Card,
    CardContent,
} from '@/components/ui/card';

import IconGroup from '../atoms/IconGroup';

import Image from 'next/image';

import { ArticleDetailsProp } from '@/features/article/types/article.types';
import BookmarkButton from '@/features/bookmarks/components/atoms/BookmarkButton';
import useBookmarkedArticles from '@/features/bookmarks/queries/useBookmarkedArticles';
import useAddBookmark from '@/features/bookmarks/queries/useAddBookmark';
import useDeleteBookmark from '@/features/bookmarks/queries/useDeleteBookmark';

export default function ArticleItem({article}: ArticleDetailsProp) {
    const {data: bookmarks} = useBookmarkedArticles();
    const addBookmark = useAddBookmark();
    const deleteBookmark = useDeleteBookmark();
    const isBookmarked = bookmarks?.some((bookmark) => bookmark.articleId === article.id) || false;

    const handleToggleBookmark = () => {
        if(isBookmarked) {
            deleteBookmark.mutate(article.id);
        } else {
            addBookmark.mutate(article.id);
        }
    }

    return (
        <Card className="flex flex-col px-8 py-10 gap-0 border-0 shadow-none rounded-none border-b-2 border-solid">
            <div className="flex justify-end items-center gap-1 mb-3">
                <LuCircleMinus />
                <BookmarkButton
                    isBookmarked={isBookmarked}
                    onToggle={handleToggleBookmark}
                />
                <HiOutlineDotsHorizontal />
            </div>
            <div className="flex justify-between items-center gap-12">
                <CardContent className="flex flex-col gap-2 p-0">
                    <div className="flex gap-2 items-center">
                        <Image
                            className="hidden md:block size-4 shrink-0 rounded-full"
                            height={128}
                            width={128}
                            src={article.author.avatarURL || '/lscs-logo.png'}
                            alt="Avatar"
                        />
                        <p className="font-light">{article.author.name}</p>
                    </div>
                    <div>
                        <h5 className="font-bold">{article.title}</h5>
                        <p className="text-sm">{article.subtitle}</p>
                    </div>
                    <IconGroup
                        date={article.publishedAt}
                        reactions={article.reactionCount}
                        comments={article.commentCount}
                    />
                </CardContent>
                <Image
                    className="hidden md:block w-48 aspect-video shrink-0 rounded-xl"
                    height={480}
                    width={854}
                    src={article.featuredImageUrl || '/image.jpg'}
                    alt="Preview"
                />
            </div>
        </Card>
    );
}

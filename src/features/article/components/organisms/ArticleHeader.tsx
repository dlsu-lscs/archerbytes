import Breadcrumbs from '@/features/article/components/atoms/Breadcrumbs';
import Keywords from '@/features/article/components/atoms/Keywords';
import ArticleDetails from '../molecules/ArticleDetails';
import { ArticleDetailsProp } from '@/types/article.types';
import { ArticleDetailsType } from '@/types/article.types';

import { IoHeartCircleSharp } from 'react-icons/io5';
import { ImBubble } from 'react-icons/im';

export default function ArticleHeader() {
    const placeholderArticle: ArticleDetailsType = {
        title: 'Top 10 LSCS Research and Development Officers of all time',
        quote:
            'Research and Development is the best committee in the whole universe',
        quotee: 'Ian Gabriel Ilagan',
        author: 'Charles Cordez',
        avatarURL: '/lscs-logo.png',
        occupation: 'DevOps Engineer',
        readingTime: 6,
        publicationDate: new Date('2025-10-29'),
        commentCount: 100,
        likeCount: 100,
    };

    return (
        <div className="flex flex-col gap-[10px] pt-3 mb-3 h-max ">
            <Breadcrumbs link="Home > Category > Title" />
            <ArticleDetails article={placeholderArticle} />
            <Keywords
                keywords={[
                    'Computer',
                    'Programming',
                    'Coding',
                    'Frontend',
                    'Backend',
                    'UI/UX',
                ]}
            />
            <div className="flex gap-5 text-neutral-950 text-sm">
                <div className="flex gap-2 items-center">
                    <IoHeartCircleSharp size={24} />
                    <p>Like this article</p>
                </div>
                <div className="flex gap-2 items-center">
                    <ImBubble size={24} />
                    <p>Reply to this article</p>
                </div>
            </div>
        </div>
    );
}

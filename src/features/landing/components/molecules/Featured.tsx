import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { ArticleDetailsType } from '@/features/article/types/article.types';

import FeaturedCard from './FeaturedCard';

export default function Featured() {
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
        keywords: [
            'Computer',
            'Programming',
            'Coding',
            'Frontend',
            'Backend',
            'UI/UX',
        ],
        previewURL: '/image.jpg',
    };

    return (
        <Carousel className="py-5 mt-5">
            <CarouselContent className="">
                <FeaturedCard article={placeholderArticle} />
                <FeaturedCard article={placeholderArticle} />
                <FeaturedCard article={placeholderArticle} />
                <FeaturedCard article={placeholderArticle} />
                <FeaturedCard article={placeholderArticle} />
                <FeaturedCard article={placeholderArticle} />
                <FeaturedCard article={placeholderArticle} />
                <FeaturedCard article={placeholderArticle} />
                <FeaturedCard article={placeholderArticle} />
                <FeaturedCard article={placeholderArticle} />
                <FeaturedCard article={placeholderArticle} />
                <FeaturedCard article={placeholderArticle} />
            </CarouselContent>
            <div className="absolute right-16 -top-2">
                <CarouselPrevious className="left-0 right-0 top-0 bottom-0 bg-transparent hover:bg-transparent border-0 shadow-none" />
                <CarouselNext className="left-8 top-0 bottom-0 bg-transparent hover:bg-transparent border-0 shadow-none" />
            </div>
            <h4 className="absolute -top-5 pl-2 font-bold text-lg text-neutral-950">
                Featured
            </h4>
        </Carousel>
    );
}

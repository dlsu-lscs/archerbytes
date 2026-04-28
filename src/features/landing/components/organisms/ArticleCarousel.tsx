import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

import { Card, CardContent } from '@/components/ui/card';
import CarouselCard from '../molecules/CarouselCard';
import { ArticleDetailsType } from '@/features/article/types/article.types';

export default function ArticleCarousel() {
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
        <Carousel className="col-span-full mx-5 lg:mx-30 py-5">
            <CarouselContent>
                <CarouselCard article={placeholderArticle} />
                <CarouselCard article={placeholderArticle} />
                <CarouselCard article={placeholderArticle} />
                <CarouselCard article={placeholderArticle} />
            </CarouselContent>
            <div className="hidden md:block absolute right-28 bottom-16">
                <CarouselPrevious className="left-0 right-0 top-0 bottom-0" />
                <CarouselNext className="left-10 top-0 bottom-0" />
            </div>
        </Carousel>
    );
}

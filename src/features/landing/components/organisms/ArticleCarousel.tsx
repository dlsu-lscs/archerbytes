'use client';

import {
    Carousel,
    CarouselContent,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

import CarouselCard from '../molecules/CarouselCard';
import useFeaturedArticles from '@/features/article/queries/useFeaturedArticles';
import { Skeleton } from '@/components/ui/skeleton';

export default function ArticleCarousel() {
    const { data: articles, isLoading, isError } = useFeaturedArticles();

    if (isError) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="col-span-full mx-5 lg:mx-30 py-5">
                <Skeleton className="w-full h-75 rounded-xl bg-neutral-300 dark:bg-neutral-700" />
            </div>
        );
    }

    return (
        <Carousel className="col-span-full mx-5 lg:mx-30 py-5">
            <CarouselContent>
                {articles?.map((article) => (
                    <CarouselCard key={article.id} article={article} />
                ))}
            </CarouselContent>
            <div className="hidden md:block absolute right-28 bottom-16">
                <CarouselPrevious className="left-0 right-0 top-0 bottom-0" />
                <CarouselNext className="left-10 top-0 bottom-0" />
            </div>
        </Carousel>
    );
}

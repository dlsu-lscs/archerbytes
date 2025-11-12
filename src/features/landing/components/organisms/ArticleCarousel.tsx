import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

import { Card, CardContent } from '@/components/ui/card';

export default function ArticleCarousel() {
    return (
        <Carousel className="col-span-full md:mx-30 py-5 max-h-fit">
            <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1">
                            <Card>
                                <CardContent className="flex items-center justify-center p-6 h-75">
                                    <span className="text-4xl font-semibold">{index + 1}</span>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <div className="absolute right-28 bottom-16">
                <CarouselPrevious className="left-0 right-0 top-0 bottom-0" />
                <CarouselNext className="left-10 top-0 bottom-0" />
            </div>
        </Carousel>
    );
}

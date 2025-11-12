import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

import { Card, CardContent } from '@/components/ui/card';

export default function Featured() {
    return (
        <Carousel className="py-5 mt-5 max-h-fit">
            <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index} className="basis-2/5 lg:basis-2/9">
                        <div className="p-1">
                            <Card>
                                <CardContent className="flex items-center justify-center p-6 h-35">
                                    <span className="text-4xl font-semibold">{index + 1}</span>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <div className="absolute right-16 top-0">
                <CarouselPrevious className="left-0 right-0 top-0 bottom-0 bg-transparent hover:bg-transparent border-0 shadow-none" />
                <CarouselNext className="left-8 top-0 bottom-0 bg-transparent hover:bg-transparent border-0 shadow-none" />
            </div>
        </Carousel>
    );
}

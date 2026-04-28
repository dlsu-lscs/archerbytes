import TopicChip from '@/components/atoms/TopicChip';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { ArticleDetailsProp } from '@/features/article/types/article.types';
import Image from 'next/image';

export default function FeaturedCard({ article }: ArticleDetailsProp) {
    return (
        <CarouselItem className="basis-2/4 lg:basis-2/7 w-50 md:w-35">
            <Card className="relative py-0 h-55 w-full flex flex-col justify-end">
                <Image
                    src={article.previewURL}
                    alt={article.title}
                    fill
                    className="object-cover z-5 rounded-xl brightness-50"
                />
                <CardContent className="flex items-end justify-start p-6 z-10">
                    <div className="">
                        <div className="flex flex-col gap-1">
                            <CardDescription>
                                <div className="flex flex-col items-start gap-1">
                                    <p className="text-xs text-neutral-400">
                                        By: {article.author}
                                    </p>
                                    <div className="flex gap-2">
                                        {article.keywords.slice(0, 1).map((item, index) => (
                                            <TopicChip key={index}>{item}</TopicChip>
                                        ))}
                                    </div>
                                </div>
                            </CardDescription>
                            <CardTitle className="text-xs md:text-sm/4 text-neutral-50">
                                {article.title}
                            </CardTitle>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </CarouselItem>
    );
}

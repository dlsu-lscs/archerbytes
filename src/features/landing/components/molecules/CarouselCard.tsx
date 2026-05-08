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

export default function CarouselCard({ article }: ArticleDetailsProp) {
  return (
    <CarouselItem>
      <Card className="relative">
        <Image
          src={article.previewURL}
          alt={article.title}
          fill
          className="object-cover w-full z-5 rounded-xl brightness-50"
        />
        <CardContent className="flex items-end justify-start p-6 h-75 z-10">
          <div className="w-[75%]">
            <div className="flex flex-col gap-1">
              <CardDescription>
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <p className="text-xs text-neutral-400">
                    By: {article.author}
                  </p>
                  <div className="hidden md:flex gap-2 w-25 md:w-100">
                    {article.keywords
                      .slice(0, 3)
                      .map((item: string, index: number) => (
                        <TopicChip key={index}>{item}</TopicChip>
                      ))}
                  </div>
                  <div className="md:hidden flex gap-2 w-25 md:w-100">
                    {article.keywords
                      .slice(0, 2)
                      .map((item: string, index: number) => (
                        <TopicChip key={index}>{item}</TopicChip>
                      ))}
                  </div>
                </div>
              </CardDescription>
              <CardTitle className="text-lg/5 md:text-3xl text-neutral-50">
                {article.title}
              </CardTitle>
              <CardDescription className="truncate w-75 md:w-100 text-neutral-400">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Velit
                obcaecati dolores deleniti voluptates dolor commodi laboriosam
                voluptatem voluptas dolorem? Temporibus veritatis unde sequi
                dolor quos dolorum perspiciatis, alias corrupti consequatur!
              </CardDescription>
            </div>
          </div>
        </CardContent>
      </Card>
    </CarouselItem>
  );
}

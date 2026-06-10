import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { CarouselItem } from '@/components/ui/carousel';
import { FeedArticleProp } from '@/features/article/types/article.types';
import Image from 'next/image';
import Link from 'next/link';

export default function CarouselCard({ article }: FeedArticleProp) {
  return (
    <CarouselItem>
      <Link href={`/articles/${article.slug}`}>
        <Card className="relative hover:opacity-95 transition-opacity cursor-pointer overflow-hidden">
          <Image
            src={article.featuredImageUrl || '/image.jpg'}
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
                      By: {article.author.name}
                    </p>
                    <div className="hidden md:flex gap-2 w-25 md:w-100">
                      {article.category.name}
                    </div>
                    <div className="md:hidden flex gap-2 w-25 md:w-100">
                      {article.category.name}
                    </div>
                  </div>
                </CardDescription>
                <CardTitle className="text-lg/5 md:text-3xl text-neutral-50">
                  {article.title}
                </CardTitle>
                <CardDescription className="truncate w-75 md:w-100 text-neutral-400">
                  {article.subtitle}
                </CardDescription>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </CarouselItem>
  );
}

import Image from 'next/image';
import TopicButton from '../atoms/TopicButton';
import { CategoryType } from '@/features/article/types/article.types';
import Link from 'next/link';

interface TopicSearchSectionProps {
  categories?: CategoryType[];
  isLoading: boolean;
  isError: boolean;
}

export default function TopicSearchSection({categories, isLoading, isError}: TopicSearchSectionProps) {
  if(!isLoading && (!categories || categories.length === 0 || isError)) {
    return null;
  }

  const displayedCategories = categories?.slice(0, 6) || [];

  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex justify-between items-center text-primary">
        <div className="flex gap-2 items-center">
          <Image
            src={'/recommended.webp'}
            height={24}
            width={24}
            alt="Recommended"
            className="size-8"
          />
          <h6 className="font-medium text-md">Recommended Topics</h6>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-2 gap-y-2">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 bg-neutral-300 animate-pulse rounded-full"></div>
          ))
        ) : (
          displayedCategories.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`}>
              <TopicButton>{category.name}</TopicButton>
            </Link>
          ))
        )}
      </div>
      {categories && categories.length > 6 && (
        <p className=" text-primary text-sm cursor-pointer hover:underline">See More</p>
      )}
    </div>
  );
}

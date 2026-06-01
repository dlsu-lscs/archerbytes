import { Skeleton } from '@/components/ui/skeleton';

export default function ArticleItemSkeleton() {
  return (
    <div className="flex flex-col px-8 py-10 gap-0 border-b-2 border-solid">
      <div className="flex justify-end items-center gap-1 mb-4">
        <Skeleton className="h-4 w-16 bg-neutral-300 dark:bg-neutral-700" />
      </div>
      <div className="flex justify-between items-center gap-12">
        <div className="flex flex-col gap-3 w-full">
          <div className="flex gap-2 items-center">
            <Skeleton className="hidden md:block size-4 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <Skeleton className="h-4 w-24 bg-neutral-300 dark:bg-neutral-700" />
          </div>
          <div>
            <Skeleton className="h-6 w-3/4 mb-2 bg-neutral-300 dark:bg-neutral-700" />
            <Skeleton className="h-4 w-full mb-1 bg-neutral-300 dark:bg-neutral-700" />
            <Skeleton className="h-4 w-2/3 bg-neutral-300 dark:bg-neutral-700" />
          </div>
          <Skeleton className="h-4 w-32 mt-2 bg-neutral-300 dark:bg-neutral-700" />
        </div>
        <Skeleton className="hidden md:block w-48 aspect-video shrink-0 rounded-xl bg-neutral-300 dark:bg-neutral-700" />
      </div>
    </div>
  );
}

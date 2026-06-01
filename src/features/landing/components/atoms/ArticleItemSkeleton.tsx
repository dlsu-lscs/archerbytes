import { Skeleton } from '@/components/ui/skeleton';

export default function ArticleItemSkeleton() {
  return (
    <div className="rounded-2xl border shadow-sm overflow-hidden">
      {/* Action bar */}
      <div className="flex justify-between items-center px-5 pt-4 pb-0">
        <Skeleton className="h-5 w-20 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        <Skeleton className="h-5 w-16 bg-neutral-300 dark:bg-neutral-700" />
      </div>

      {/* Card body */}
      <div className="flex justify-between items-start gap-6 px-5 py-4">
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div className="flex gap-2 items-center">
            <Skeleton className="hidden md:block size-5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <Skeleton className="h-4 w-28 bg-neutral-300 dark:bg-neutral-700" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-5 w-3/4 bg-neutral-300 dark:bg-neutral-700" />
            <Skeleton className="h-4 w-full bg-neutral-300 dark:bg-neutral-700" />
            <Skeleton className="h-4 w-2/3 bg-neutral-300 dark:bg-neutral-700" />
          </div>
        </div>
        <Skeleton className="hidden md:block w-36 aspect-video shrink-0 rounded-xl bg-neutral-300 dark:bg-neutral-700" />
      </div>

      {/* Footer */}
      <div className="flex items-center gap-1 px-4 pb-3">
        <Skeleton className="h-8 w-16 rounded-md bg-neutral-300 dark:bg-neutral-700" />
        <Skeleton className="h-8 w-12 rounded-md bg-neutral-300 dark:bg-neutral-700" />
        <Skeleton className="h-8 w-20 rounded-md ml-auto bg-neutral-300 dark:bg-neutral-700" />
      </div>
    </div>
  );
}

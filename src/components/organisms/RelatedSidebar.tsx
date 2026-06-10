'use client';

import TopicSearchSection from '../molecules/TopicSearchSection';
import SavedArticlesSection from '../molecules/SavedArticlesSection';
import useCategoryList from '@/features/article/queries/useCategoryList';
import useBookmarks from '@/features/bookmarks/queries/useBookmarks';
import { useSession } from '@/lib/auth/client';
import { usePathname } from 'next/navigation';

export default function RelatedSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useCategoryList();
  const {
    data: bookmarks,
    isLoading: isLoadingBookmarks,
    isError: isErrorBookmarks,
  } = useBookmarks();

  return (
    <div className="hidden lg:flex flex-col gap-6 p-5 max-w-64">
      <TopicSearchSection
        categories={categories}
        isLoading={isLoadingCategories}
        isError={isErrorCategories}
      />
      <SavedArticlesSection
        bookmarks={bookmarks}
        isLoading={isLoadingBookmarks}
        isError={isErrorBookmarks}
        isAuthenticated={!!session?.user}
        pathname={pathname}
      />
    </div>
  );
}

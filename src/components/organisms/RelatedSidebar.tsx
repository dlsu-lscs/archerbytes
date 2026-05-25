'use client'

import TopicSearchSection from '../molecules/TopicSearchSection';
import SavedArticlesSection from '../molecules/SavedArticlesSection';
import useCategoryList from '@/features/article/queries/useCategoryList';

export default function RelatedSidebar() {
  const {data: categories, isLoading, isError} = useCategoryList();

  return (
    <div className="hidden lg:flex flex-col gap-6 p-5 max-w-64">
      <TopicSearchSection categories={categories} isLoading={isLoading} isError={isError} />
      <SavedArticlesSection />
    </div>
  );
}

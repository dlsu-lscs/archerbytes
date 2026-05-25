'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useArticleList from '@/features/article/queries/useArticleList';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SortDropdown from '../atoms/SortDropdown';
import { useEffect, useState } from 'react';
import { option } from '@/features/article/queries/useArticleList';
import ArticleList from '../molecules/ArticleList';
import CategoryDropdown from '../atoms/CategoryDropdown';
import { useSearchParams } from 'next/navigation';

export default function Feed() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const categoryIdParam = searchParams.get('categoryId');

  const [activeTab, setActiveTab] = useState(tabParam || 'for-you');
  const [forYouSort, setForYouSort] = useState<option>('newest');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(categoryIdParam ? parseInt(categoryIdParam, 10) : null);

  const forYouQuery = useArticleList({
    sort: forYouSort,
    enabled: activeTab === 'for-you',
  });
  const trendingQuery = useArticleList({
    sort: 'popular',
    enabled: activeTab === 'trending',
  });
  const categoryQuery = useArticleList({
    sort: 'newest',
    categoryId: selectedCategory,
    enabled: activeTab === 'by-category',
  });

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
    if (categoryIdParam) {
      setSelectedCategory(parseInt(categoryIdParam, 10));
    }
  }, [tabParam, categoryIdParam])

  return (
    <section className="flex flex-col gap-2.5">
      <Tabs
        defaultValue="for-you"
        value={activeTab}
        onValueChange={setActiveTab}
        className="lg:max-w-[50vw]"
      >
        <TabsList className="w-full flex justify-between items-center">
          <div className="hidden md:flex">
            <TabsTrigger value="for-you">For you</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="by-category">By category</TabsTrigger>
          </div>

          <div className="hidden md:inline-flex border-b-2 text-foreground dark:text-muted-foreground h-[calc(100%-1px)] items-center justify-end gap-1.5 px-2 py-1 grow">
            {activeTab === 'for-you' && (
              <div className="ml-auto flex items-center pr-2">
                <SortDropdown
                  value={forYouSort}
                  onChange={setForYouSort}
                  align="end"
                />
              </div>
            )}
          </div>

          <div className="flex md:hidden w-full border-b-2 text-foreground dark:text-muted-foreground items-center justify-between h-[calc(100%-1px)] px-2 py-1 grow">
            <div className="flex items-center">
              {activeTab === 'for-you' && (
                <SortDropdown
                  value={forYouSort}
                  onChange={setForYouSort}
                  align="start"
                />
              )}
            </div>

            <div className="flex items-center">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="border-0 shadow-none h-8 w-32.5">
                  <SelectValue placeholder="For you" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="for-you">For you</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="by-category">By category</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsList>
        <TabsContent value="for-you" className="flex flex-col gap-2">
          <ArticleList
            articles={forYouQuery.data}
            isLoading={forYouQuery.isLoading}
            isError={forYouQuery.isError}
          />
        </TabsContent>

        <TabsContent value="trending" className="flex flex-col gap-2">
          <ArticleList
            articles={trendingQuery.data}
            isLoading={trendingQuery.isLoading}
            isError={trendingQuery.isError}
          />
        </TabsContent>

        <TabsContent value="by-category" className="flex flex-col gap-2">
          <div className="flex sm:justify-start md:justify-end w-full pt-1 pb-2">
            <CategoryDropdown
              value={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>
          <ArticleList
            articles={categoryQuery.data}
            isLoading={categoryQuery.isLoading}
            isError={categoryQuery.isError}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}

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
import Featured from '../molecules/Featured';
import { useState } from 'react';
import { option } from '@/features/article/queries/useArticleList';
import ArticleList from '../molecules/ArticleList';

export default function Feed() {
    const [activeTab, setActiveTab] = useState('for-you');
    const [forYouSort, setForYouSort] = useState<option>('newest');
    const [selectedCategory, setSelectedCategory] = useState(1);
    const sortParam: option = activeTab === 'trending' ? 'popular' : forYouSort;
    const categoryParam = activeTab === 'by-category' ? selectedCategory : null;
    const {data: articles, isLoading, isError} = useArticleList({
        sort: sortParam,
        categoryId: categoryParam
    });

    return (
        <section className="flex flex-col gap-2.5">
            <Tabs defaultValue='for-you' value={activeTab} onValueChange={setActiveTab} className="lg:max-w-[50vw]">
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
                    <Featured />
                    <ArticleList 
                        articles={articles} 
                        isLoading={isLoading} 
                        isError={isError} 
                    />
                </TabsContent>

                <TabsContent value="trending" className="flex flex-col gap-2">
                    <ArticleList 
                        articles={articles} 
                        isLoading={isLoading} 
                        isError={isError} 
                    />
                </TabsContent>

                <TabsContent value="by-category" className="flex flex-col gap-2">
                    <ArticleList 
                        articles={articles} 
                        isLoading={isLoading} 
                        isError={isError} 
                    />
                </TabsContent>
            </Tabs>
        </section>
    );
}

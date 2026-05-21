'use client';

import ArticleItem from '../molecules/ArticleItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useArticleList from '@/features/article/queries/useArticleList';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import Featured from '../molecules/Featured';
import { useState } from 'react';
import { option } from '@/features/article/queries/useArticleList';

export default function Feed() {
    const [activeTab, setActiveTab] = useState('for-you');
    const sortParam: option = activeTab === 'trending' ? 'popular' : 'newest';
    const {data: articles, isLoading, isError} = useArticleList(sortParam);

    return (
        <section className="flex flex-col gap-[10px]">
            <Tabs defaultValue='for-you' value={activeTab} onValueChange={setActiveTab} className="lg:max-w-[50vw]">
                <TabsList className="w-full">
                    <div className="hidden md:block">
                        <TabsTrigger value="for-you">For you</TabsTrigger>
                        <TabsTrigger value="trending">Trending</TabsTrigger>
                        <TabsTrigger value="by-category">By category</TabsTrigger>
                    </div>
                    <div className="md:hidden border-b-2 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] items-center justify-end gap-1.5 px-2 py-1 grow">
                        <Select value={activeTab} onValueChange={setActiveTab}>
                            <SelectTrigger className="border-0 shadow-none">
                                <SelectValue placeholder="For you" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="for-you">For you</SelectItem>
                                <SelectItem value="trending">Trending</SelectItem>
                                <SelectItem value="by-category">By category</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="hidden md:inline-flex border-b-2 text-foreground dark:text-muted-foreground h-[calc(100%-1px)] items-center justify-end gap-1.5 px-2 py-1 grow"></div>
                </TabsList>
                <TabsContent value="for-you" className="flex flex-col gap-2">
                    <Featured />
                    {articles?.map((article) => (
                        <ArticleItem key={article.id} article={article} />
                    ))}
                </TabsContent>

                <TabsContent value="trending" className="flex flex-col gap-2">
                    {articles?.map((article) => (
                        <ArticleItem key={article.id} article={article} />
                    ))}
                </TabsContent>

                <TabsContent value="by-category" className="flex flex-col gap-2">
                    <div className="py-10 text-center text-muted-foreground">
                        Category filtering coming soon.
                    </div>
                </TabsContent>
            </Tabs>
        </section>
    );
}

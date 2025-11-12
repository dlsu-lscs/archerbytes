import ArticleItem from '../molecules/ArticleItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArticleDetailsType } from '@/types/article.types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import Featured from '../molecules/Featured';

export default function Feed() {
    const placeholderArticle: ArticleDetailsType = {
        title: 'Top 10 LSCS Research and Development Officers of all time',
        quote:
            'Research and Development is the best committee in the whole universe',
        quotee: 'Ian Gabriel Ilagan',
        author: 'Charles Cordez',
        avatarURL: '/lscs-logo.png',
        occupation: 'DevOps Engineer',
        readingTime: 6,
        publicationDate: new Date('2025-10-29'),
        commentCount: 100,
        likeCount: 100,
    };

    return (
        <section className="flex flex-col gap-[10px]">
            <Tabs defaultValue="for-you">
                <TabsList className="w-full">
                    <div className="hidden md:block">
                        <TabsTrigger value="for-you">For you</TabsTrigger>
                        <TabsTrigger value="trending">Trending</TabsTrigger>
                        <TabsTrigger value="by-category">By category</TabsTrigger>
                    </div>
                    <div className="md:hidden border-b-2 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] items-center justify-end gap-1.5 px-2 py-1 grow">
                        <Select>
                            <SelectTrigger className="border-0 shadow-none">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="hidden md:inline-flex border-b-2 text-foreground dark:text-muted-foreground h-[calc(100%-1px)] items-center justify-end gap-1.5 px-2 py-1 grow"></div>
                </TabsList>
                <TabsContent value="for-you" className="flex flex-col gap-2">
                    <Featured />
                    <ArticleItem article={placeholderArticle}></ArticleItem>
                    <ArticleItem article={placeholderArticle}></ArticleItem>
                    <ArticleItem article={placeholderArticle}></ArticleItem>
                    <ArticleItem article={placeholderArticle}></ArticleItem>
                    <ArticleItem article={placeholderArticle}></ArticleItem>
                </TabsContent>
            </Tabs>
        </section>
    );
}

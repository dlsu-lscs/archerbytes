import ArticleItem from './ArticleItem';
import ArticleItemSkeleton from '../atoms/ArticleItemSkeleton';
import { FeedArticleType } from '@/features/article/types/article.types';

interface ArticleListProps {
    articles: FeedArticleType[] | undefined;
    isLoading: boolean;
    isError: boolean;
}

export default function ArticleList({ 
    articles, 
    isLoading, 
    isError, 
}: ArticleListProps) {
    if (isError) {
        return <div className="py-10 text-center text-red-500">Failed to load articles. Please try again</div>;
    }

    if (isLoading) {
        return (
            <>
                <ArticleItemSkeleton />
                <ArticleItemSkeleton />
                <ArticleItemSkeleton />
            </>
        );
    }

    if (!articles || articles.length === 0) {
        return (
            <div className="py-10 text-center text-muted-foreground">
                No articles found. Check back later!
            </div>
        );
    }

    return (
        <>
            {articles.map((article) => (
                <ArticleItem key={article.id} article={article} />
            ))}
        </>
    );
}
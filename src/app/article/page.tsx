import Sidebar from '@/components/organisms/Sidebar';
import RelatedSidebar from '@/features/article/components/organisms/RelatedSidebar';
import ArticleHeader from '@/features/article/components/organisms/ArticleHeader';

export default function ArticlePage() {
    return (
        <div className="grid grid-cols-[1fr_2fr_1fr] justify-center grow py-10">
            <div className="flex justify-end grow">
                <Sidebar />
            </div>
            <main className="flex grow-3 px-10">
                <ArticleHeader />
            </main>
            <div className="grow">
                <RelatedSidebar />
            </div>
        </div>
    );
}

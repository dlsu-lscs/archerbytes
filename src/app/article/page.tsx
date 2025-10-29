import Sidebar from '@/components/organisms/Sidebar';
import RelatedSidebar from '@/features/article/components/organisms/RelatedSidebar';
import ArticleHeader from '@/features/article/components/organisms/ArticleHeader';
import ArticleContent from '@/features/article/components/molecules/ArticleContent';
import Discussion from '@/features/article/components/organisms/Discussion';

export default function ArticlePage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] justify-center grow py-10">
            <div className="hidden lg:flex justify-end">
                <Sidebar />
            </div>
            <main className="flex flex-col gap-[30px] px-10">
                <section className="flex flex-col gap-[10px]">
                    <ArticleHeader />
                    <ArticleContent />
                </section>
                <Discussion />
            </main>
            <div className="hidden lg:block grow">
                <RelatedSidebar />
            </div>
        </div>
    );
}

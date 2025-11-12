import Sidebar from '@/components/organisms/Sidebar';
import RelatedSidebar from '@/components/organisms/RelatedSidebar';
import Feed from '@/features/landing/components/organisms/Feed';
import ArticleCarousel from '@/features/landing/components/organisms/ArticleCarousel';

export default function LandingPage() {
    return (
        <div className="grid grid-cols-1 grid-row-2 grid-rows-[auto_1fr] lg:grid-cols-[1fr_2fr_1fr] justify-center grow bg-neutral-50">
            <ArticleCarousel />
            <div className="hidden lg:flex justify-end">
                <Sidebar />
            </div>
            <main className="flex flex-col gap-[30px] px-10">
                <Feed />
            </main>
            <div className="hidden lg:block grow">
                <RelatedSidebar />
            </div>
        </div>
    );
}

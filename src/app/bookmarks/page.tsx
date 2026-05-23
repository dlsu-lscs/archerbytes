import Sidebar from '@/components/organisms/Sidebar';
import RelatedSidebar from '@/components/organisms/RelatedSidebar';
import BookmarkedList from '@/features/bookmarks/components/organisms/BookmarkedList';

export default function ArticlePage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] justify-center grow py-10 bg-neutral-50">
            <div className="hidden lg:flex justify-end">
                <Sidebar />
            </div>
            <main className="flex flex-col gap-[30px] px-10">
                <h1 className='mt-3 text-5xl text-black font-bold'>Saved Articles</h1>
                <BookmarkedList />
            </main>
            <div className="hidden lg:block grow">
                <RelatedSidebar />
            </div>
        </div>
    );
}

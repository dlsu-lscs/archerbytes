import RecentlyViewedSection from '../molecules/RecentlyViewedSection';
import TopicSearchSection from '../molecules/TopicSearchSection';
import SavedArticlesSection from '../molecules/SavedArticlesSection';

export default function RelatedSidebar() {
    return (
        <div className="hidden lg:flex flex-col gap-6 p-5 max-w-64">
            <RecentlyViewedSection />
            <TopicSearchSection />
            <SavedArticlesSection count={50} />
        </div>
    );
}

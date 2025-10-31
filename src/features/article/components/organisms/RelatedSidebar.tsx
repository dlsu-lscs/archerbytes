import RelatedArticleSection from '../molecules/RelatedArticleSection';
import TopicSearchSection from '../molecules/TopicSearchSection';
import SavedArticlesSection from '../molecules/SavedArticlesSection';

export default function RelatedSidebar() {
    return (
        <div className="hidden lg:flex flex-col gap-3 p-5 pt-20 max-w-64 rounded-xl border-dashed border-neutral-400 border-2">
            <RelatedArticleSection />
            <TopicSearchSection />
            <SavedArticlesSection count={50} />
        </div>
    );
}

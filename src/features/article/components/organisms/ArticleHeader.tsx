import Breadcrumbs from '@/features/article/components/atoms/Breadcrumbs';
import Keywords from '@/features/article/components/atoms/Keywords';
import ArticleDetails from '../molecules/ArticleDetails';

export default function ArticleHeader() {
    return (
        <div className="">
            <Breadcrumbs link="Home > Category > Title" />
            <ArticleDetails />
            <Keywords keywords={['Computer', 'Programming', 'Coding']} />
        </div>
    );
}

import Breadcrumbs from '@/features/article/components/atoms/Breadcrumbs';
import Keywords from '@/features/article/components/atoms/Keywords';
import ArticleDetails from '../molecules/ArticleDetails';
import { ArticleDetailsType } from '../molecules/ArticleDetails';

export default function ArticleHeader() {
    const placeholderArticle: ArticleDetailsType = {
        title: 'Top 10 LSCS Research and Development Officers of all time',
        quote:
            'Research and Development is the best committee in the whole universe',
        quotee: 'Ian Gabriel Ilagan',
        author: 'Charles Cordez',
        occupation: 'DevOps Engineer',
        readingTime: 6,
        publicationDate: new Date('2025-10-29'),
    };

    return (
        <div className="flex flex-col gap-[10px] py-3 h-max border-solid border-neutral-400 border-b-2">
            <Breadcrumbs link="Home > Category > Title" />
            <ArticleDetails article={placeholderArticle} />
            <Keywords
                keywords={[
                    'Computer',
                    'Programming',
                    'Coding',
                    'Frontend',
                    'Backend',
                    'UI/UX',
                ]}
            />
        </div>
    );
}

import Breadcrumbs from '@/features/article/components/atoms/Breadcrumbs';
import Keywords from '@/features/article/components/atoms/Keywords';
import ArticleDetails from '../molecules/ArticleDetails';
import { ArticleDetailsType } from '@/features/article/types/article.types';
import { IoHeartCircleSharp } from 'react-icons/io5';
import { ImBubble } from 'react-icons/im';

interface ArticleHeaderProps {
  article: ArticleDetailsType;
}

export default function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <div className="flex flex-col gap-[10px] pt-3 mb-3 h-max">
      <Breadcrumbs link={`Home > ${article.category.name} > ${article.title}`} />
      <ArticleDetails article={article} />
      <Keywords article={article} />
      <div className="flex gap-5 text-neutral-950 text-sm">
        <div className="flex gap-2 items-center">
          <IoHeartCircleSharp size={24} />
          <p>Like this article</p>
        </div>
        <div className="flex gap-2 items-center">
          <ImBubble size={24} />
          <p>Reply to this article</p>
        </div>
      </div>
    </div>
  );
}

import TopicChip from './TopicChip';
import { SmallArticleItemType } from '../../types/article.types';

export default function SmallArticleItem({
    topic,
    title,
    author,
    date,
}: SmallArticleItemType) {
    return (
        <div className="flex flex-col gap-1 text-neutral-950">
            <div className="flex items-center gap-2">
                <div className="size-4 shrink-0 rounded-full bg-neutral-400"></div>
                <p className="font-light text-xs">{author}</p>
            </div>
            <h6 className="text-md font-bold align-middle">{title}</h6>
            <div className="flex gap-2">
                <TopicChip>{topic}</TopicChip>
                <p className="text-xs font-light">{date}</p>
            </div>
        </div>
    );
}

import TopicChip from './TopicChip';
import { SmallArticleItemType } from '../../types/article.types';

export default function SmallArticleItem({
    topic,
    title,
    author,
}: SmallArticleItemType) {
    return (
        <div>
            <TopicChip topic={topic} />
            <h6 className="text-md font-bold align-middle">
                {title}
                <span className="font-light text-xs">
                    {' \u2022 '} {author}
                </span>
            </h6>
        </div>
    );
}

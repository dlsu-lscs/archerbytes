import TopicChip from '../atoms/TopicChip';
import { ArticleDetailsProp } from '../../types/article.types';

export default function ArticleDetails({ article }: ArticleDetailsProp) {
    return (
        <div className="flex flex-col gap-[10px] text-neutral-950">
            <TopicChip>Gaming</TopicChip>
            <h1 className="text-3xl md:text-5xl font-bold text-justify md:text-left">
                {article.title.toUpperCase()}
            </h1>
            <h5 className="font-extralight text-neutral-500">
                &rdquo;{article.quote}&rdquo; - {article.quotee}
            </h5>
            <div className="flex items-start gap-5">
                <div className="flex gap-3 items-center">
                    <div className="size-12 shrink-0 rounded-full bg-neutral-400"></div>
                    <div className="flex flex-col">
                        <h5 className="font-bold">{article.author}</h5>
                        <p className="text-sm">{article.occupation}</p>
                    </div>
                </div>
                <p>{'\u2022'}</p>
                <p>{article.readingTime} min read</p>
                <p>{'\u2022'}</p>
                <p>
                    {article.publicationDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                    })}
                </p>
            </div>
        </div>
    );
}

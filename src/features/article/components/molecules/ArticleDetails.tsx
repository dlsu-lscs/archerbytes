import Image from 'next/image';
import TopicChip from '../atoms/TopicChip';
import { ArticleDetailsType } from '@/features/article/types/article.types';

function calcReadingTime(content: string): number {
    return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));
}

export default function ArticleDetails({ article }: { article: ArticleDetailsType }) {

    return (
        <div className="flex flex-col gap-[10px] text-neutral-950">
            <TopicChip>{article.category.name}</TopicChip>
            <h1 className="text-2xl md:text-5xl font-bold">
                {article.title.toUpperCase()}
            </h1>
            {article.quote && article.quotee && (
                <h5 className="font-extralight text-neutral-500">
                    &rdquo;{article.quote}&rdquo; - {article.quotee}
                </h5>
            )}
            <div className="flex items-start gap-5 text-sm">
                <div className="flex gap-3 items-center">
                    <div className="flex gap-3 items-center flex-1 min-w-0">
                        <div className="size-12 shrink-0 rounded-full bg-neutral-400 overflow-hidden relative">
                            {article.author.avatarURL && (
                                <Image
                                    src={`${article.author.avatarURL}` || "/archerbytes-bg.png"}
                                    alt={article.author.name}
                                    fill
                                    className="object-cover"
                                />
                            )}
                        </div>

                        <div className="flex flex-col min-w-0">
                            <h5 className="font-bold">{article.author.name}</h5>
                            {article.author.occupation && (
                                <p className="text-xs">{article.author.occupation}</p>
                            )}
                        </div>
                    </div>
                    {/* 

                    <p>{'•'}</p>
                    <p className="align-middle">{calcReadingTime(article.content)} min read</p>

                     */}
                    <p className='shrink-0'>{'•'}</p>
                    <p className='shrink-0 whitespace-nowrap'>
                        {(article.publishedAt ?? article.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </p>
                </div>
            </div>
        </div>
    );
}

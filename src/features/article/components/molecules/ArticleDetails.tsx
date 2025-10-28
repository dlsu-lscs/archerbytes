export type ArticleDetailsType = {
    title: string;
    quote: string;
    quotee: string;
    author: string;
    occupation: string;
    readingTime: number;
    publicationDate: Date;
};

export default function ArticleDetails({
    article,
}: {
    article: ArticleDetailsType;
}) {
    return (
        <div className="flex flex-col gap-[10px]">
            <h1 className="text-5xl font-bold">{article.title.toUpperCase()}</h1>
            <h5 className="font-extralight">
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
                <p>Estimated time to read: {article.readingTime} mins</p>
                <p>{'\u2022'}</p>
                <p>
                    {article.publicationDate.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                    })}
                </p>
            </div>
        </div>
    );
}

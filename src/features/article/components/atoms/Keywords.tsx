import Link from 'next/link';

type KeywordsType = {
    keywords: string[];
};

export default function Keywords({ keywords = [] }: KeywordsType) {
    return (
        <div className="flex gap-2">
            <p className="mr-1">Keywords:</p>
            {keywords.map((item, index) =>
                index === keywords.length - 1 ? (
                    <Link className="underline" href="/" key={index}>
                        {item}
                    </Link>
                ) : (
                    <Link className="underline" href="/" key={index}>
                        {item},{' '}
                    </Link>
                ),
            )}
        </div>
    );
}

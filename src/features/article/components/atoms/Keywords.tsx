import Link from 'next/link';
import { KeywordsType } from '../../types/article.types';

export default function Keywords({ keywords = [] }: KeywordsType) {
    return (
        <div className="flex flex-wrap gap-2 py-2 border-solid border-neutral-400 border-y-2">
            <p className="mr-1 font-bold text-neutral-950">Keywords:</p>
            {keywords.map((item, index) =>
                index === keywords.length - 1 ? (
                    <Link className="underline text-blue-400" href="/" key={index}>
                        {item}
                    </Link>
                ) : (
                    <Link className="underline text-blue-400" href="/" key={index}>
                        {item},{' '}
                    </Link>
                ),
            )}
        </div>
    );
}

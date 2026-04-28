import Link from 'next/link';
import { ArticleDetailsProp } from '@/features/article/types/article.types';

export default function Keywords({ article }: ArticleDetailsProp) {
    return (
        <div className="flex flex-wrap gap-2 py-2 border-solid border-neutral-400 border-y-2 text-sm">
            <p className="mr-1 font-bold text-neutral-950">Keywords:</p>
            {article.keywords.map((item, index) =>
                index === article.keywords.length - 1 ? (
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

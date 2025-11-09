import Image from 'next/image';
import SmallArticleItem from '../atoms/SmallArticleItem';

type SavedArticlesSectionType = {
    count: number;
};

export default function SavedArticlesSection({
    count,
}: SavedArticlesSectionType) {
    return (
        <div className="flex flex-col gap-[10px]">
            <div className="flex justify-between items-center text-primary">
                <div className="flex gap-2">
                    <Image
                        src={'/read_later.webp'}
                        height={24}
                        width={24}
                        alt="Read Later"
                    />
                    <h6 className="font-medium text-lg">Read Later</h6>
                </div>
                <p className="font-light text-md">Clear</p>
            </div>
            <div className="flex flex-col gap-6">
                <SmallArticleItem
                    topic="Genre"
                    title="CCPROG2: Everything you need to pass"
                    author="Airon Bantillo"
                    date="Oct 11"
                />
                <SmallArticleItem
                    topic="Genre"
                    title="CCPROG2: Everything you need to pass"
                    author="Airon Bantillo"
                    date="Oct 11"
                />
                <SmallArticleItem
                    topic="Genre"
                    title="CCPROG2: Everything you need to pass"
                    author="Airon Bantillo"
                    date="Oct 11"
                />
                <SmallArticleItem
                    topic="Genre"
                    title="CCPROG2: Everything you need to pass"
                    author="Airon Bantillo"
                    date="Oct 11"
                />
            </div>
            <p className="text-sm font-light text-primary">See all ({count})</p>
        </div>
    );
}

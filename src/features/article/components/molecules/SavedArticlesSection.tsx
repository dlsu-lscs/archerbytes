import SmallArticleItem from '../atoms/SmallArticleItem';

type SavedArticlesSectionType = {
    count: number;
};

export default function SavedArticlesSection({
    count,
}: SavedArticlesSectionType) {
    return (
        <div className="flex flex-col gap-[10px]">
            <div className="flex justify-between items-end">
                <h6 className="font-medium text-lg">Save for later</h6>
                <p className="font-light text-md text-neutral-400">Clear</p>
            </div>
            <div className="flex flex-col gap-2">
                <SmallArticleItem
                    topic="Genre"
                    title="CCPROG2: Everything you need to pass"
                    author="Airon Bantillo"
                />
                <SmallArticleItem
                    topic="Genre"
                    title="CCPROG2: Everything you need to pass"
                    author="Airon Bantillo"
                />
                <SmallArticleItem
                    topic="Genre"
                    title="CCPROG2: Everything you need to pass"
                    author="Airon Bantillo"
                />
                <SmallArticleItem
                    topic="Genre"
                    title="CCPROG2: Everything you need to pass"
                    author="Airon Bantillo"
                />
                <p className="text-sm font-light">See all ({count})</p>
            </div>
        </div>
    );
}

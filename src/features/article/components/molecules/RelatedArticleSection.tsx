import SmallArticleItem from '../atoms/SmallArticleItem';

export default function RelatedArticleSection() {
    return (
        <div className="flex flex-col gap-[10px]">
            <h3 className="font-medium text-lg">Related Articles</h3>
            <div>
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
            </div>
        </div>
    );
}

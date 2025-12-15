import Image from 'next/image';
import SmallArticleItem from '../atoms/SmallArticleItem';

export default function RecentlyViewedSection() {
    return (
        <div className="flex flex-col gap-[10px]">
            <div className="flex justify-between items-center text-primary">
                <div className="flex gap-2 items-center">
                    <Image
                        src={'/recently_viewed.webp'}
                        height={24}
                        width={24}
                        alt="Recently Viewed"
                    />
                    <h6 className="font-medium text-md">Recently Viewed</h6>
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
        </div>
    );
}

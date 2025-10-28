import TopicButton from '../atoms/TopicButton';

export default function TopicSearchSection() {
    return (
        <div className="flex flex-col gap-[10px]">
            <h6 className="font-medium text-lg">Search by topic</h6>
            <div className="grid grid-cols-2 gap-x-2 gap-y-2">
                <TopicButton topic="Topic" />
                <TopicButton topic="Topic" />
                <TopicButton topic="Topic" />
                <TopicButton topic="Topic" />
                <TopicButton topic="Topic" />
                <TopicButton topic="Topic" />
            </div>
            <p className="w-full text-center text-neutral-500 text-sm">See More</p>
        </div>
    );
}

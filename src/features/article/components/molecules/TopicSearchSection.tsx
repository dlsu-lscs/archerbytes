import Image from 'next/image';
import TopicButton from '../atoms/TopicButton';

export default function TopicSearchSection() {
    return (
        <div className="flex flex-col gap-[10px]">
            <div className="flex justify-between items-center text-primary">
                <div className="flex gap-2">
                    <Image
                        src={'/recommended.webp'}
                        height={24}
                        width={24}
                        alt="Recommended"
                    />
                    <h6 className="font-medium text-lg">Recommended Topics</h6>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-2">
                <TopicButton>Topic</TopicButton>
                <TopicButton>Topic</TopicButton>
                <TopicButton>Topic</TopicButton>
                <TopicButton>Topic</TopicButton>
                <TopicButton>Topic</TopicButton>
                <TopicButton>Topic</TopicButton>
            </div>
            <p className=" text-primary text-sm ">See More</p>
        </div>
    );
}

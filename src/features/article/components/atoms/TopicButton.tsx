import { Button } from '@/components/ui/button';

type TopicProps = {
    topic: string;
};

export default function TopicButton({ topic }: TopicProps) {
    return (
        <Button className="rounded-full bg-neutral-400 text-neutral-900 h-7">
            {topic}
        </Button>
    );
}

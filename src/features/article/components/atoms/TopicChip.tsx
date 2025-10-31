import { Button } from '@/components/ui/button';
import { TopicProps } from '../../types/article.types';

export default function TopicChip({ topic }: TopicProps) {
    return (
        <Button className="bg-neutral-600 text-neutral-50 px-8 py-[0.5px] rounded-full h-auto text-[0.65rem] font-light">
            {topic}
        </Button>
    );
}

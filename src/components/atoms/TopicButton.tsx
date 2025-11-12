import { Button } from '@/components/ui/button';
import { TopicType } from '../../types/topic.types';

export default function TopicButton({ children }: TopicType) {
    return (
        <Button className="rounded-full bg-neutral-400 text-neutral-900 h-7 border-solid border-2 border-neutral-950 py-4">
            {children}
        </Button>
    );
}

import { Badge } from '@/components/ui/badge';
import { TopicType } from '../../types/topic.types';

export default function TopicChip({ children }: TopicType) {
    return (
        <Badge className="bg-neutral-600 text-neutral-50 text-[10px] px-6 py-0 font-light">
            {children}
        </Badge>
    );
}

import { FaRegCalendar } from 'react-icons/fa6';
import { IoHeartCircleSharp } from 'react-icons/io5';
import { ImBubble } from 'react-icons/im';

import { IconsType } from '@/features/article/types/article.types';

export default function IconGroup({ date, reactions, comments }: IconsType) {
    return (
        <div className="flex gap-2 items-center">
            <div className="flex gap-1 items-center">
                <FaRegCalendar />
                <p>
                    {date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                    })}
                </p>
            </div>
            <div className="flex gap-1 items-center">
                <IoHeartCircleSharp />
                <p>{reactions}</p>
            </div>
            <div className="flex gap-1 items-center">
                <ImBubble />
                <p>{comments}</p>
            </div>
        </div>
    );
}

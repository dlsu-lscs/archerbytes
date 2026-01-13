import { FaRegCalendar } from 'react-icons/fa6';
import { IoHeartCircleSharp } from 'react-icons/io5';
import { ImBubble } from 'react-icons/im';

import { IconsType } from '@/types/article.types';

export default function IconGroup({ date, likes, comments }: IconsType) {
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
                <p>{likes}</p>
            </div>
            <div className="flex gap-1 items-center">
                <ImBubble />
                <p>{comments}</p>
            </div>
        </div>
    );
}

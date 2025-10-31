import Comment from '@/features/comments/components/molecules/Comment';
import DraftComment from './DraftComment';
import { Button } from '@/components/ui/button';

export default function Discussion() {
    const comment1 = {
        avatarURL: '/lscs-logo.png',
        userId: 'Alec Nono',
        occupation: 'Frontend Engineer',
        isAuthor: false,
        content: 'I love LSCS! Pogi talaga mga nasa Research and Development',
        likeCount: 5000,
        replyCount: 10,
    };

    return (
        <div className="flex flex-col gap-3">
            <h3 className="text-2xl font-bold">Discussion (Count)</h3>
            <DraftComment />
            <div className="flex flex-col gap-[10px]">
                <Comment comment={comment1} />
                <Comment comment={comment1}>
                    <Comment comment={comment1} />
                    <Comment comment={comment1} />
                </Comment>
                <Comment comment={comment1} />
            </div>
        </div>
    );
}

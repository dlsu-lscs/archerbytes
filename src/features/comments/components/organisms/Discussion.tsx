import Comment from '@/features/comments/components/molecules/Comment';
import DraftComment from './DraftComment';
import { CommentType } from '../../types/comment.types';

export default function Discussion() {
    const comment1: CommentType = {
        avatarURL: '/lscs-logo.png',
        userId: 'Alec Nono',
        occupation: 'Frontend Engineer',
        isAuthor: false,
        content: 'I love LSCS! Pogi talaga mga nasa Research and Development',
        likeCount: 5000,
        replyCount: 10,
    };

    const comment2: CommentType = {
        avatarURL: '/lscs-logo.png',
        userId: 'Charles Cordez',
        occupation: 'DevOps Engineer',
        isAuthor: true,
        content: 'I hate LSCS! Pangit talaga mga nasa Research and Development',
        likeCount: 5000,
        replyCount: 10,
    };

    return (
        <div className="flex flex-col gap-3">
            <h3 className="text-2xl font-bold text-neutral-950">
                Discussion (Count)
            </h3>
            <DraftComment />
            <div className="flex flex-col gap-[10px]">
                <Comment comment={comment2} />
                <Comment comment={comment1}>
                    <Comment comment={comment1} />
                    <Comment comment={comment1} />
                </Comment>
                <Comment comment={comment1} />
            </div>
        </div>
    );
}

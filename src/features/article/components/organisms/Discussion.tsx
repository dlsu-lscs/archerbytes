import Comment from '@/features/article/components/molecules/Comment';
import { Input } from '@/components/ui/input';

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
            <Input
                className="py-6 px-5 placeholder:text-neutral-950 bg-neutral-300 rounded-sm"
                placeholder="Share your thoughts here..."
            />
            <div className="flex flex-col gap-[10px]">
                <Comment comment={comment1} />
                <Comment comment={comment1} />
                <Comment comment={comment1} />
                <Comment comment={comment1} />
            </div>
        </div>
    );
}

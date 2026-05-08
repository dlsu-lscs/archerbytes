"use client"
import Comment from '@/features/comments/components/molecules/Comment';
import DraftComment from './DraftComment';
import { useGetComments } from '../../hooks/useGetComments';

export default function Discussion() {

    const { data } = useGetComments("1");

    return (
        <div className="flex flex-col gap-3">
            <h3 className="text-2xl font-bold text-neutral-950">
                Discussion ({data.length})
            </h3>
            <DraftComment />
            <div className="flex flex-col gap-[10px]">
                {data.map((comment) =>
                    <Comment comment={comment}></Comment>
                )}
            </div>
        </div>
    );
}

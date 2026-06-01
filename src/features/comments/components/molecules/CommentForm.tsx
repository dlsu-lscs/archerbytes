'use client';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

import { toast } from 'sonner';
import { useAuthStore } from '@/store/use-auth-store';
import { useCreateComment } from '../../hooks/useCreateComment';
import { useSession } from '@/lib/auth/client';

interface CommentFormProps {
  articleId: number;
  replyTo?: number | null;
  onSuccess?: () => void;
  placeholder?: string;
  buttonText?: string;
  expandable?: boolean;
}

export default function CommentForm({
  articleId,
  replyTo,
  onSuccess,
  placeholder = 'Share your thoughts here...',
  buttonText = 'Post',
  expandable = false,
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const { data: session } = useSession();
  const user = session?.user;
  const setLoginOpen = useAuthStore((state) => state.setLoginOpen);
  const createComment = useCreateComment();

  const handleSubmit = () => {
    if (!user) {
      setLoginOpen();
      return;
    }

    if (!content.trim()) return;

    createComment.mutate(
      {
        data: {
          userId: user.id,
          articleId,
          content: content.trim(),
          replyTo: replyTo ?? null,
        },
      },
      {
        onSuccess: () => {
          setContent('');
          toast.success('Posted!', { position: 'top-center' });
          onSuccess?.();
        },
      },
    );
  };

  return (
    <Card>
      <CardContent className="flex rounded-2xl relative">
        <Image
          className="size-8 md:size-12 my-[3px] shrink-0 rounded-full mr-3 z-30"
          height={128}
          width={128}
          src={user?.image || '/lscs-logo.png'}
          alt="Avatar"
        />
        <div className="flex flex-col gap-3 w-full">
          <Textarea
            className={`resize-none py-4 px-5 rounded-sm transition-all ${expandable && !isFocused && !content ? 'min-h-0 h-14 overflow-hidden' : 'min-h-24'}`}
            placeholder={placeholder}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {(!expandable || isFocused || content) && (
            <div className="flex justify-end">
              <Button
                className="px-10 w-fit"
                onClick={handleSubmit}
                disabled={createComment.isPending || !content.trim()}
              >
                {createComment.isPending ? 'Posting...' : buttonText}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

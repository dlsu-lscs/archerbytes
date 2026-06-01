'use client';

import ArticleItem from '@/features/landing/components/molecules/ArticleItem';
import ArticleItemSkeleton from '@/features/landing/components/atoms/ArticleItemSkeleton';
import useBookmarks from '../../queries/useBookmarks';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ConfirmationModal from '@/components/atoms/ConfirmationModal';

export default function BookmarkedList() {
  const router = useRouter();
  const { data: bookmarks, isLoading, isError, error } = useBookmarks();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isError && error?.message === 'Unauthorized') {
      toast.error('Please log in to view your bookmarks.');
      router.push('/login');
    }
  }, [isError, error, router]);

  if (isError && error?.message === 'Unauthorized') {
    return (
      <div className="text-center py-10 text-gray-500">
        Redirecting to login...
      </div>
    );
  }

  const handleConfirmClear = () => {
    toast.info('Lucky for your saved articles, this feature doesnt exist yet');
    setIsModalOpen(false);
  }

  return (
    <div>
      <div className="flex items-center justify-end mb-5">        
        {!isLoading && !isError && bookmarks && bookmarks.length > 0 && (
          <button
            onClick={() => setIsModalOpen(true)} 
            className="text-md font-normal text-neutral-500 hover:text-red-500 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {isError && (
        <p className="text-red-500">
          Failed to load your bookmarks. Please try again later.
        </p>
      )}

      {isLoading && (
        <>
          <ArticleItemSkeleton />
          <ArticleItemSkeleton />
          <ArticleItemSkeleton />
        </>
      )}

      {!isLoading && !isError && bookmarks?.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          <p>You haven&apos;t saved any articles yet.</p>
        </div>
      )}

      {!isLoading && !isError && bookmarks && bookmarks.length > 0 && (
        <div className="flex flex-col gap-2">
          {bookmarks.map((bookmark) => (
            <ArticleItem key={bookmark.id} article={bookmark.article} />
          ))}
        </div>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        title="Clear all saved articles?"
        message="This will remove all articles from your Read Later list. This action cannot be undone"
        confirmText="Yes, Clear All"
        cancelText="Cancel"
        loadingText="Clearing..."
        onConfirm={handleConfirmClear}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
}

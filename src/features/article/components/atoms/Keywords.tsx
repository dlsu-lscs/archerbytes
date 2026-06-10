import { ArticleDetailsType } from '@/features/article/types/article.types';

export default function Keywords({ article }: { article: ArticleDetailsType }) {
  const tags = article.tags ?? [];
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 py-2 border-solid border-neutral-400 border-y-2 text-sm">
      <p className="mr-1 font-bold text-neutral-950">Tags:</p>
      {tags.map((tag, index) => (
        <p className="text-neutral-600" key={index}>
          {tag}
          {index < tags.length - 1 ? ',' : ''}{' '}
        </p>
      ))}
    </div>
  );
}

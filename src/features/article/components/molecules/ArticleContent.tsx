import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import Photo from '@/features/article/components/atoms/Photo';

interface ArticleContentProps {
  content: string;
  featuredImageUrl: string | null;
}

export default function ArticleContent({
  content,
  featuredImageUrl,
}: ArticleContentProps) {
  // Normalize escaped \n sequences stored as literal strings by the CMS
  const normalized = content.replace(/\\n/g, '\n');

  return (
    <div className="flex flex-col gap-5">
      {featuredImageUrl && <Photo source={featuredImageUrl} />}
      <div className="article-content">
        <ReactMarkdown remarkPlugins={[remarkBreaks]}>
          {normalized}
        </ReactMarkdown>
      </div>
    </div>
  );
}

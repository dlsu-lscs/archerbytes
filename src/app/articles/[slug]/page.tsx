import { notFound } from 'next/navigation';
import { ArticleService } from '@/features/article/services/service';
import ArticleHeader from '@/features/article/components/organisms/ArticleHeader';
import ArticleContent from '@/features/article/components/molecules/ArticleContent';
import Discussion from '@/features/comments/components/organisms/Discussion';
import Sidebar from '@/components/organisms/Sidebar';
import RelatedSidebar from '@/components/organisms/RelatedSidebar';
import type { ArticleDetailsType } from '@/features/article/types/article.types';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const result = await ArticleService.list({ page: 1, limit: 1000, sort: 'newest' });
  return result.items.map((article) => ({ slug: article.slug }));
}

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const raw = await ArticleService.getBySlug(slug);

  if (!raw) {
    notFound();
  }

  const article: ArticleDetailsType = {
    id: raw.id,
    title: raw.title,
    subtitle: raw.subtitle,
    slug: raw.slug,
    content: raw.content,
    categoryId: raw.categoryId,
    category: {
      id: raw.category.id,
      name: raw.category.name,
      slug: raw.category.slug,
    },
    userId: raw.userId,
    featuredImageUrl: raw.featuredImageUrl ?? null,
    tags: raw.tags ?? null,
    metaTitle: raw.metaTitle ?? null,
    metaDescription: raw.metaDescription ?? null,
    metaImageUrl: raw.metaImageUrl ?? null,
    status: raw.status,
    isEdited: raw.isEdited,
    publishedAt: raw.publishedAt,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    author: raw.author,
    commentCount: raw.commentCount,
    reactionCount: raw.reactionCount,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] justify-center grow py-10 bg-neutral-50">
      <div className="hidden lg:flex justify-end">
        <Sidebar />
      </div>
      <main className="flex flex-col gap-[30px] px-10">
        <section className="flex flex-col gap-[10px]">
          <ArticleHeader article={article} />
          <ArticleContent
            content={article.content}
            featuredImageUrl={article.featuredImageUrl}
          />
        </section>
        <Discussion articleId={article.id} />
      </main>
      <div className="hidden lg:block grow">
        <RelatedSidebar />
      </div>
    </div>
  );
}

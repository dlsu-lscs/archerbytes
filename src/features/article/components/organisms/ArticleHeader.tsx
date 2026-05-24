import Breadcrumbs from '@/features/article/components/atoms/Breadcrumbs';
import Keywords from '@/features/article/components/atoms/Keywords';
import ArticleDetails from '../molecules/ArticleDetails';
import { ArticleDetailsType } from '@/features/article/types/article.types';

import { IoHeartCircleSharp } from 'react-icons/io5';
import { ImBubble } from 'react-icons/im';

export default function ArticleHeader() {
  const placeholderArticle: ArticleDetailsType = {
    title: 'Top 10 LSCS Research and Development Officers of all time',
    quote:
      'Research and Development is the best committee in the whole universe',
    quotee: 'Ian Gabriel Ilagan',
    author: 'Charles Cordez',
    avatarURL: '/lscs-logo.png',
    previewURL: '/image.jpg',
    readingTime: 6,
    publicationDate: new Date('2025-10-29'),
    commentCount: 100,
    reactionCount: 100,
    likeCount: 100,
    keywords: [
      'Computer',
      'Programming',
      'Coding',
      'Frontend',
      'Backend',
      'UI/UX',
    ],
    id: 0,
    subtitle: '',
    slug: '',
    content: '',
    categoryId: 0,
    userId: '',
    featuredImageUrl: null,
    tags: [],
    metaTitle: null,
    metaDescription: null,
    metaImageUrl: null,
    status: 'published',
    isEdited: false,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    occupation: null,
  };

  return (
    <div className="flex flex-col gap-[10px] pt-3 mb-3 h-max ">
      <Breadcrumbs link="Home > Category > Title" />
      <ArticleDetails article={placeholderArticle} />
      <Keywords article={placeholderArticle} />
      <div className="flex gap-5 text-neutral-950 text-sm">
        <div className="flex gap-2 items-center">
          <IoHeartCircleSharp size={24} />
          <p>Like this article</p>
        </div>
        <div className="flex gap-2 items-center">
          <ImBubble size={24} />
          <p>Reply to this article</p>
        </div>
      </div>
    </div>
  );
}

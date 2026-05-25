import { useQuery } from "@tanstack/react-query";
import { FeedArticleType } from "../types/article.types";

export default function useFeaturedArticles(){
  return useQuery({
    queryKey: ['articles', 'featured'],
    queryFn: getFeaturedArticles,
    staleTime: 5 * 60 * 1000,
    select: (data) => {
      return data.data.map((article: Omit<FeedArticleType, 'publishedAt' | 'createdAt'> & {
          publishedAt: string;
          createdAt: string;
      }) => ({
        ...article,
        publishedAt: new Date(article.publishedAt),
        createdAt: new Date(article.createdAt),
      })) as FeedArticleType[];
    }
  })
}

const getFeaturedArticles = async () => {
  const params = new URLSearchParams({
    limit: '5',
    status: 'published',
    sort: 'popular',
  })

  const res = await fetch(`/api/articles?${params.toString()}`);

  if(!res.ok){
    throw new Error('Failed to fetch featured articles')
  }

  return res.json();
}
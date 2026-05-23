import { useQuery } from "@tanstack/react-query";
import { CategoryType } from "../types/article.types";

export default function useCategoryList() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    select: (data) => {
      return data.data.map((category: Omit<CategoryType, 'createdAt'> & {
        createdAt: string;
      }) => ({
        ...category,
        createdAt: new Date(category.createdAt),
      })) as CategoryType[];
    }
  })
}

const getCategories = async () => {
  const res = await fetch('/api/categories')

  if(!res.ok){
    throw new Error('Failed to fetch categories');
  }

  return res.json();
}
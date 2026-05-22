'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import useCategoryList from '@/features/article/queries/useCategoryList';

interface CategoryDropdownProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

export default function CategoryDropdown({value, onChange}: CategoryDropdownProps){
  const {data: categories, isLoading, isError} = useCategoryList();
  let activeCategory = 'All Categories';
  if (isLoading) {
      activeCategory = 'Loading...';
  } else if (value !== null && categories) {
      activeCategory = categories.find((c) => c.id === value)?.name || activeCategory;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger 
        disabled={isLoading || isError}
        className="flex items-center justify-between rounded-full border-2 border-gray-300 bg-transparent px-3 h-9 w-36 text-sm outline-none focus:ring-1 focus:ring-ring hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className='truncate'>{activeCategory}</span>
        <ChevronDown className="h-3 w-3 opacity-50 shrink-0 ml-1" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem
          onClick={() => onChange(null)}
          className='text-xs cursor-pointer'
        >
          All Categories
        </DropdownMenuItem>   
        {categories?.map((category) => (
          <DropdownMenuItem
            key={category.id}
            onClick={() => onChange(category.id)}
            className='text-xs cursor-pointer'
          >
            {category.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
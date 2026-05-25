'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { option } from '@/features/article/queries/useArticleList';

interface SortDropdownProps {
  value: option;
  onChange: (value: option) => void;
  align?: 'start' | 'center' | 'end';
}

export default function SortDropdown({
  value,
  onChange,
  align = 'end',
}: SortDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-between rounded-full border border-input bg-transparent px-3 h-6 w-36 text-sm outline-none focus:ring-1 focus:ring-ring hover:bg-accent hover:text-accent-foreground">
        {value === 'newest' ? 'Newest First' : 'Oldest First'}
        <ChevronDown className="h-3 w-3 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        <DropdownMenuItem
          onClick={() => onChange('newest')}
          className="text-xs cursor-pointer"
        >
          Newest First
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onChange('oldest')}
          className="text-xs cursor-pointer"
        >
          Oldest First
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

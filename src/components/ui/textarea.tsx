import * as React from 'react';

import { cn } from '@/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.target.style.height = 'auto'; // reset height
        e.target.style.height = `${e.target.scrollHeight}px`; // set new height
    };

    return (
        <textarea
            onInput={handleInput}
            data-slot="textarea"
            className={cn(
                'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-1 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                className,
            )}
            {...props}
        />
    );
}

export { Textarea };

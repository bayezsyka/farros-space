import { cn } from '@/utils';
import React from 'react';

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
    orientation?: 'horizontal' | 'vertical';
}

export const Divider = ({
    orientation = 'horizontal',
    className,
    ...props
}: DividerProps) => {
    return (
        <div
            className={cn(
                'shrink-0 bg-border',
                orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
                className
            )}
            {...props}
        />
    );
};

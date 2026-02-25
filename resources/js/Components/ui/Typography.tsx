import { cn } from '@/utils';
import React from 'react';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'lead' | 'large' | 'small' | 'muted';
    as?: React.ElementType;
}

export const Typography = ({
    variant = 'p',
    as: Component,
    className,
    ...props
}: TypographyProps) => {
    const variants = {
        h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
        h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
        h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
        h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
        p: 'leading-7 [&:not(:first-child)]:mt-6',
        lead: 'text-xl text-muted-foreground',
        large: 'text-lg font-semibold',
        small: 'text-sm font-medium leading-none',
        muted: 'text-sm text-muted-foreground',
    };

    const Tag = Component || (['h1', 'h2', 'h3', 'h4', 'p'].includes(variant) ? variant : 'p');

    return (
        <Tag
            className={cn(variants[variant], className)}
            {...props}
        />
    );
};

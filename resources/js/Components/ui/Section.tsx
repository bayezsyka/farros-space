import { cn } from '@/utils';
import React from 'react';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Section = ({ spacing = 'md', className, ...props }: SectionProps) => {
    const spacings = {
        none: 'py-0',
        sm: 'py-8 md:py-12',
        md: 'py-12 md:py-24',
        lg: 'py-24 md:py-32',
        xl: 'py-32 md:py-48',
    };

    return (
        <section
            className={cn(spacings[spacing], className)}
            {...props}
        />
    );
};

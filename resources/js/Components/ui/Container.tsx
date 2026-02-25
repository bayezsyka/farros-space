import { cn } from '@/utils';
import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    fluid?: boolean;
}

export const Container = ({ fluid, className, ...props }: ContainerProps) => {
    return (
        <div
            className={cn(
                'mx-auto px-4 md:px-6 lg:px-8',
                fluid ? 'max-w-full' : 'max-w-7xl',
                className
            )}
            {...props}
        />
    );
};

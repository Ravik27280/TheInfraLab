import React from 'react';
import { cn } from '../utils/cn';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'success' | 'warning' | 'error' | 'primary' | 'default';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
    const variants = {
        success: 'bg-green-500/10 text-green-500 border-green-500/20',
        warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        error: 'bg-red-500/10 text-red-500 border-red-500/20',
        primary: 'bg-[#B58863]/10 text-[#B58863] border-[#B58863]/20',
        default: 'bg-[rgb(var(--color-card))] text-[rgb(var(--color-text-secondary))] border-[rgb(var(--color-border))]',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border',
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    );
};

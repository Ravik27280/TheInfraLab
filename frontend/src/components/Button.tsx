import React, { type ButtonHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    className,
    children,
    ...props
}) => {
    const baseStyles = 'rounded-app font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-hover))] text-white shadow-app',
        secondary: 'bg-[rgb(var(--color-surface))] hover:bg-[rgb(var(--color-card))] text-[rgb(var(--color-text-primary))] border border-[rgb(var(--color-border))]',
        danger: 'bg-[rgb(var(--color-error))] hover:opacity-90 text-white shadow-app',
        ghost: 'hover:bg-[rgb(var(--color-card))] text-[rgb(var(--color-text-primary))]',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
        icon: 'p-2',
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </button>
    );
};

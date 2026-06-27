import React, { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useAppStore } from '../store';

export const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useAppStore();

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-app hover:bg-[rgb(var(--color-card))] transition-theme"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
            ) : (
                <Moon className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
            )}
        </button>
    );
};

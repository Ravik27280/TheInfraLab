import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileQuestion, Layers, Trophy, Target, User as UserIcon, LayoutDashboard, BookOpen, MessageSquare } from 'lucide-react';
import { cn } from '../utils/cn';
import { Logo } from './Logo';

const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/problems', label: 'Problems', icon: FileQuestion },
    { to: '/designs', label: 'My Designs', icon: Layers },
    { to: '/practice', label: 'Practice Mode', icon: Target },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { to: '/profile', label: 'Profile', icon: UserIcon },
    { to: '/docs', label: 'Docs', icon: BookOpen },
    { to: '/feedback', label: 'Feedback', icon: MessageSquare },
];

import { UpgradeModal } from './UpgradeModal';
import { useAppStore } from '../store';
import { ENABLE_PRO_PLANS } from '../config';


export const Sidebar: React.FC = () => {
    const { user } = useAppStore();
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = React.useState(false);

    return (
        <aside className="w-64 bg-[rgb(var(--color-card))] border-r border-[rgb(var(--color-border))] flex flex-col h-full transition-theme z-10">
            {/* Logo */}
            <div className="p-6 border-b border-[rgb(var(--color-border))]">
                <div className="flex items-center gap-2">
                    <Logo className="w-10 h-10 flex-shrink-0 text-[#B58863]" />
                    <div>
                        <span className="text-lg font-bold text-[rgb(var(--color-text-primary))] leading-tight block">
                            Infralab
                        </span>
                        <span className="text-[10px] text-[rgb(var(--color-text-secondary))] font-medium">
                            Master Scalability
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.to}>
                                <NavLink
                                    to={item.to}
                                    className={({ isActive }) =>
                                        cn(
                                            'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-1 border border-transparent',
                                            isActive
                                                ? 'bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] border-[rgb(var(--color-primary))]/20 font-bold'
                                                : 'text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-bg-secondary))]/50 hover:text-[rgb(var(--color-text-primary))]'
                                        )
                                    }
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Upgrade CTA */}
            {ENABLE_PRO_PLANS && user?.role === 'free' && (
                <div className="px-4 pb-6">
                    <div className="p-5 rounded-2xl bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-primary))] border border-[rgb(var(--color-border))] shadow-sm relative overflow-hidden">
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-95 text-[rgb(var(--color-text-secondary))]">Unlock everything</p>
                        <h3 className="font-bold text-lg mb-4 tracking-tight">Upgrade to Pro</h3>
                        <button
                            className="w-full bg-[rgb(var(--color-primary))] text-white hover:bg-[rgb(var(--color-primary-hover))] py-2 rounded-xl font-bold text-sm transition-all active:scale-[0.98]"
                            onClick={() => setIsUpgradeModalOpen(true)}
                        >
                            Go Pro
                        </button>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="p-4 border-t border-[rgb(var(--color-border))]">
                <div className="text-xs text-[rgb(var(--color-text-secondary))]">
                    © 2026 Infralab
                </div>
            </div>

            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
            />
        </aside>
    );
};

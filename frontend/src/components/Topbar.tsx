import React, { useState } from 'react';
import { Bell, LogOut, Search, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { ThemeToggle } from './ThemeToggle';

export const Topbar: React.FC = () => {
    const { user, logout, searchQuery, setSearchQuery } = useAppStore();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, text: "Welcome to Infralab! 🚀 Start sketching your first architecture.", time: "Just now", read: false },
        { id: 2, text: "Gemini AI Evaluator upgraded to v1.5 Pro with faster reviews.", time: "2h ago", read: true },
        { id: 3, text: "New Challenge available: Design a URL Shortener.", time: "1d ago", read: true }
    ]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleToggleNotifications = () => {
        setShowNotifications(!showNotifications);
        setShowUserMenu(false);
    };

    const handleToggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
        setShowNotifications(false);
    };

    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <header className="h-20 bg-[rgb(var(--color-card))] border-b border-[rgb(var(--color-border))] flex items-center justify-between px-8 transition-theme z-10">
            {/* Left: Search Bar */}
            <div className="flex-1 max-w-xl">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
                    <input
                        type="search"
                        placeholder="Search challenges..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-xl py-2.5 pl-10 pr-4 text-sm text-[rgb(var(--color-text-primary))] placeholder-[rgb(var(--color-text-secondary))] focus:outline-none focus:bg-[rgb(var(--color-surface))] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                    />
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                <ThemeToggle />
                
                {/* Notifications Panel */}
                <div className="relative">
                    <button 
                        onClick={handleToggleNotifications}
                        className="p-2.5 rounded-xl bg-[rgb(var(--color-bg-secondary))] hover:bg-[rgb(var(--color-bg-secondary))]/80 border border-[rgb(var(--color-border))] transition-theme text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] relative"
                        title="Notifications"
                    >
                        <Bell className="w-5 h-5" />
                        {notifications.some(n => !n.read) && (
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[rgb(var(--color-card))]" />
                        )}
                    </button>

                    {showNotifications && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                            <div className="absolute right-0 mt-2 w-80 bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-app shadow-app-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-4 py-2 border-b border-[rgb(var(--color-border))] flex justify-between items-center">
                                    <span className="text-sm font-bold text-[rgb(var(--color-text-primary))]">Notifications</span>
                                    <button className="text-xs text-violet-500 hover:text-violet-400 font-medium bg-transparent border-0 cursor-pointer p-0" onClick={handleMarkAllRead}>
                                        Mark all read
                                    </button>
                                </div>
                                <div className="max-h-60 overflow-y-auto divide-y divide-[rgb(var(--color-border))]">
                                    {notifications.map(n => (
                                        <div key={n.id} className={`px-4 py-3 hover:bg-[rgb(var(--color-bg-secondary))]/50 transition-colors ${!n.read ? 'bg-violet-500/5' : ''}`}>
                                            <p className="text-xs text-[rgb(var(--color-text-primary))] leading-relaxed">{n.text}</p>
                                            <span className="text-[10px] text-[rgb(var(--color-text-secondary))] mt-1 block">{n.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Settings Action */}
                <button 
                    onClick={() => navigate('/settings')}
                    className="p-2.5 rounded-xl bg-[rgb(var(--color-bg-secondary))] hover:bg-[rgb(var(--color-bg-secondary))]/80 border border-[rgb(var(--color-border))] transition-theme text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"
                    title="Settings"
                >
                    <Settings className="w-5 h-5" />
                </button>

                <div className="w-px h-8 bg-[rgb(var(--color-border))] mx-3" />

                {/* User Profile with Dropdown */}
                <div className="relative">
                    <button
                        onClick={handleToggleUserMenu}
                        className="flex items-center gap-3 hover:opacity-80 transition-theme text-right"
                    >
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-sm font-bold text-[rgb(var(--color-text-primary))]">
                                {user?.name || 'Alex Rivera'}
                            </span>
                            <span className="text-xs font-semibold text-[#B58863]">
                                {user?.role === 'pro' ? 'Pro Member' : 'Standard Member'}
                            </span>
                        </div>
                        <img 
                            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || user?.email || 'Guest')}`} 
                            alt={user?.name || 'User'} 
                            className="w-10 h-10 rounded-xl object-cover border border-[rgb(var(--color-border))]" 
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-app shadow-app-lg py-2 z-50">
                            <div className="px-4 py-2 border-b border-[rgb(var(--color-border))]">
                                <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                                    {user?.email}
                                </p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-[rgb(var(--color-surface))] transition-theme"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

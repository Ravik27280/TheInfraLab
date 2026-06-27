import React, { useState } from 'react';
import { User, Bell, Shield, CreditCard, ChevronRight, Loader2 } from 'lucide-react';
import { useAppStore } from '../store';
import { Button } from '../components/Button';
import { updateProfile } from '../api/profile.api';
import { useNavigate } from 'react-router-dom';
import { ENABLE_PRO_PLANS } from '../config';

export const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, setUser } = useAppStore();
    const [activeTab, setActiveTab] = useState('profile');
    const [name, setName] = useState(user?.name || '');
    const [loading, setLoading] = useState(false);
    const [notifLoading, setNotifLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');

    // Notification states loaded from localStorage
    const [emailUpdates, setEmailUpdates] = useState(() => {
        const saved = localStorage.getItem('settings_emailUpdates');
        return saved !== null ? saved === 'true' : true;
    });
    const [weeklyReport, setWeeklyReport] = useState(() => {
        const saved = localStorage.getItem('settings_weeklyReport');
        return saved !== null ? saved === 'true' : true;
    });
    const [marketing, setMarketing] = useState(() => {
        const saved = localStorage.getItem('settings_marketing');
        return saved !== null ? saved === 'true' : false;
    });

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
    ];

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const updatedUser = await updateProfile({ name });
            setUser(updatedUser);
            setMessage('Profile updated successfully!');
            setMessageType('success');
        } catch (error: any) {
            setMessage(error.message || 'Failed to update profile.');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveNotifications = async () => {
        setNotifLoading(true);
        setMessage('');
        try {
            // Simulate brief delay for premium feel
            await new Promise(resolve => setTimeout(resolve, 800));
            localStorage.setItem('settings_emailUpdates', String(emailUpdates));
            localStorage.setItem('settings_weeklyReport', String(weeklyReport));
            localStorage.setItem('settings_marketing', String(marketing));
            setMessage('Notification settings saved successfully!');
            setMessageType('success');
        } catch (error) {
            setMessage('Failed to save settings.');
            setMessageType('error');
        } finally {
            setNotifLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 h-[calc(100vh-4rem)]">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">Settings</h1>
                    <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
                        Manage your account settings and preferences.
                    </p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
                    Back
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 h-full">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <nav className="space-y-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setMessage(''); // Clear message
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                                        ${isActive 
                                            ? 'bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]' 
                                            : 'text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-bg-secondary))] hover:text-[rgb(var(--color-text-primary))]'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className="w-4 h-4" />
                                        {tab.label}
                                    </div>
                                    {isActive && <ChevronRight className="w-4 h-4" />}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-xl p-6 shadow-sm overflow-y-auto max-h-[calc(100vh-12rem)]">
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-medium text-[rgb(var(--color-text-primary))]">Profile Details</h2>
                            <div className="flex items-center gap-4 py-4 border-b border-[rgb(var(--color-border))]">
                                <img 
                                    src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || user?.email || 'Guest')}`} 
                                    alt={user?.name || 'User'} 
                                    className="w-16 h-16 rounded-full border border-[rgb(var(--color-border))] object-cover bg-[rgb(var(--color-bg-secondary))]" 
                                />
                                <div>
                                    <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">System Generated Avatar</p>
                                    <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-0.5">Avatars are professionally auto-generated based on your account. Custom uploads are disabled.</p>
                                </div>
                            </div>
                            
                            <form onSubmit={handleSaveProfile} className="grid gap-4 max-w-md">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[rgb(var(--color-text-secondary))]">Display Name</label>
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-lg px-3 py-2 text-sm text-[rgb(var(--color-text-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]/50"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[rgb(var(--color-text-secondary))]">Email Address</label>
                                    <input 
                                        type="email" 
                                        defaultValue={user?.email || ''}
                                        disabled
                                        className="w-full bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg px-3 py-2 text-sm text-[rgb(var(--color-text-secondary))] cursor-not-allowed"
                                    />
                                    <p className="text-xs text-[rgb(var(--color-text-tertiary))]">Your email is tied to your Google account.</p>
                                </div>
                                {message && (
                                    <div className={`text-sm font-medium mt-1 ${messageType === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {message}
                                    </div>
                                )}
                                <div className="pt-4">
                                    <Button type="submit" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                                                Saving...
                                            </>
                                        ) : 'Save Changes'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-medium text-[rgb(var(--color-text-primary))]">Notification Preferences</h2>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))]">Configure how you want to receive alerts.</p>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-2 border-b border-[rgb(var(--color-border))]">
                                    <span className="text-sm text-[rgb(var(--color-text-primary))]">Email updates about new problems</span>
                                    <div 
                                        onClick={() => setEmailUpdates(!emailUpdates)}
                                        className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-200 ${emailUpdates ? 'bg-[rgb(var(--color-primary))]' : 'bg-gray-400 dark:bg-gray-600'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-all duration-200 ${emailUpdates ? 'right-0.5' : 'left-0.5'}`}></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-[rgb(var(--color-border))]">
                                    <span className="text-sm text-[rgb(var(--color-text-primary))]">Weekly progress report</span>
                                    <div 
                                        onClick={() => setWeeklyReport(!weeklyReport)}
                                        className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-200 ${weeklyReport ? 'bg-[rgb(var(--color-primary))]' : 'bg-gray-400 dark:bg-gray-600'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-all duration-200 ${weeklyReport ? 'right-0.5' : 'left-0.5'}`}></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-[rgb(var(--color-border))]">
                                    <span className="text-sm text-[rgb(var(--color-text-primary))]">Marketing and offers</span>
                                    <div 
                                        onClick={() => setMarketing(!marketing)}
                                        className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-200 ${marketing ? 'bg-[rgb(var(--color-primary))]' : 'bg-gray-400 dark:bg-gray-600'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-all duration-200 ${marketing ? 'right-0.5' : 'left-0.5'}`}></div>
                                    </div>
                                </div>
                                {message && (
                                    <div className={`text-sm font-medium mt-1 ${messageType === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {message}
                                    </div>
                                )}
                                <div className="pt-4">
                                    <Button onClick={handleSaveNotifications} disabled={notifLoading}>
                                        {notifLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                                                Saving...
                                            </>
                                        ) : 'Save Preferences'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-medium text-[rgb(var(--color-text-primary))]">Security Settings</h2>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))]">Manage your account security.</p>
                            <div className="pt-4 border-t border-[rgb(var(--color-border))]">
                                <h3 className="text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">Connected Accounts</h3>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded border border-gray-200">
                                        <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" fillRule="evenodd"/>
                                            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853" fillRule="evenodd"/>
                                            <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9.001c0 1.452.348 2.827.957 4.042l3.007-2.336z" fill="#FBBC05" fillRule="evenodd"/>
                                            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" fillRule="evenodd"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">Google</p>
                                        <p className="text-xs text-[rgb(var(--color-text-secondary))]">Connected</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'billing' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-medium text-[rgb(var(--color-text-primary))]">Billing & Plan</h2>
                            <div className="bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-[rgb(var(--color-text-primary))] capitalize">Current Plan: {user?.role || 'Free'}</h3>
                                        <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
                                            {user?.role === 'pro' ? 'All advanced system design features unlocked.' : 'Basic limits apply.'}
                                        </p>
                                    </div>
                                    <div className={`px-3 py-1 text-xs font-semibold rounded-full border capitalize ${user?.role === 'pro' ? 'bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] border-[rgb(var(--color-primary))]/20' : 'bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text-secondary))] border-[rgb(var(--color-border))]'}`}>
                                        {user?.role || 'Free'} Tier
                                    </div>
                                </div>
                                {!ENABLE_PRO_PLANS ? (
                                    <p className="text-sm text-[rgb(var(--color-text-secondary))] italic">
                                        Pro subscription plans are currently disabled. Enjoy full access to all standard features!
                                    </p>
                                ) : user?.role === 'pro' ? (
                                    <Button disabled className="w-full sm:w-auto bg-emerald-500/10 text-emerald-500 border-emerald-500/20 cursor-not-allowed">
                                        Pro Subscription Active
                                    </Button>
                                ) : (
                                    <Button className="w-full sm:w-auto" onClick={() => window.location.href = '/pricing'}>
                                        Upgrade to Pro
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Shield, Zap, BarChart, CheckCircle, Calendar, ArrowLeft } from 'lucide-react';
import { useAppStore } from '../store';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { ENABLE_PRO_PLANS } from '../config';
import { updateProfile, getUserStats, getPublicProfile, type UserStats, type PublicProfile } from '../api/profile.api';

export const ProfilePage: React.FC = () => {
    const { user, setUser } = useAppStore();
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();

    const isOwnProfile = !userId || userId === user?.id;

    const [name, setName] = useState(user?.name || '');
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [stats, setStats] = useState<UserStats | null>(null);
    const [publicProfile, setPublicProfile] = useState<PublicProfile | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProfileData = async () => {
            setPageLoading(true);
            setError(null);
            try {
                if (isOwnProfile) {
                    if (user) {
                        setName(user.name);
                        try {
                            const profileData = await getPublicProfile(user.id);
                            setPublicProfile(profileData);
                            setStats(profileData.stats);
                        } catch (err) {
                            console.warn('Failed to load own profile data, falling back to local stats', err);
                            const statsData = await getUserStats();
                            setStats(statsData);
                        }
                    }
                } else if (userId) {
                    const profileData = await getPublicProfile(userId);
                    setPublicProfile(profileData);
                    setStats(profileData.stats);
                }
            } catch (err: any) {
                console.error('Failed to load profile data', err);
                setError(err.response?.data?.message || 'Failed to load user profile');
            } finally {
                setPageLoading(false);
            }
        };

        loadProfileData();
    }, [userId, user, isOwnProfile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const updatedUser = await updateProfile({ name });
            setUser(updatedUser);
            setMessage('Profile updated successfully!');
        } catch (error) {
            setMessage('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: any) => {
        if (!dateString) return 'Recently';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Recently';
            }
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (e) {
            return 'Recently';
        }
    };

    if (pageLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto py-12 px-4 text-center space-y-6">
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-red-500 mb-2">Error Loading Profile</h2>
                    <p className="text-[rgb(var(--color-text-secondary))]">{error}</p>
                </div>
                <Button variant="secondary" className="inline-flex items-center gap-2" onClick={() => navigate('/leaderboard')}>
                    <ArrowLeft className="w-4 h-4" /> Back to Leaderboard
                </Button>
            </div>
        );
    }

    const displayName = isOwnProfile ? (publicProfile?.name || user?.name) : publicProfile?.name;
    const displayRole = isOwnProfile ? (publicProfile?.role || user?.role) : publicProfile?.role;
    const displayJoinDate = isOwnProfile ? (publicProfile?.createdAt || user?.createdAt) : publicProfile?.createdAt;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
            {!isOwnProfile && (
                <button
                    onClick={() => navigate('/leaderboard')}
                    className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Leaderboard
                </button>
            )}

            <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))] mb-4">
                {isOwnProfile ? 'My Profile' : 'Architect Profile'}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
                {/* Stats Cards */}
                <div className="bg-[rgb(var(--color-card))] p-6 rounded-xl border border-[rgb(var(--color-border))] shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-[#B58863]/10 rounded-lg">
                            <Zap className="w-5 h-5 text-[#B58863]" />
                        </div>
                        <span className="text-sm font-medium text-[rgb(var(--color-text-secondary))]">Designs Created</span>
                    </div>
                    <p className="text-3xl font-bold text-[rgb(var(--color-text-primary))]">{stats?.designsCount || 0}</p>
                </div>

                <div className="bg-[rgb(var(--color-card))] p-6 rounded-xl border border-[rgb(var(--color-border))] shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                        </div>
                        <span className="text-sm font-medium text-[rgb(var(--color-text-secondary))]">Problems Solved</span>
                    </div>
                    <p className="text-3xl font-bold text-[rgb(var(--color-text-primary))]">{stats?.problemsSolved || 0}</p>
                </div>

                <div className="bg-[rgb(var(--color-card))] p-6 rounded-xl border border-[rgb(var(--color-border))] shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-[rgb(var(--color-bg-secondary))] rounded-lg">
                            <BarChart className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
                        </div>
                        <span className="text-sm font-medium text-[rgb(var(--color-text-secondary))]">Average Score</span>
                    </div>
                    <p className="text-3xl font-bold text-[rgb(var(--color-text-primary))]">{stats?.averageScore || 0}%</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Profile Info / Edit Form */}
                <div className="md:col-span-2 bg-[rgb(var(--color-card))] rounded-xl border border-[rgb(var(--color-border))] overflow-hidden shadow-sm h-fit">
                    <div className="h-32 bg-[rgb(var(--color-bg-secondary))]/50 border-b border-[rgb(var(--color-border))] flex items-end p-6 relative">
                        <div className="absolute -bottom-10 left-6">
                            <div className="w-24 h-24 bg-[rgb(var(--color-surface))] rounded-full p-1 border border-[rgb(var(--color-border))]">
                                <div className="w-full h-full bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                                    <UserIcon className="w-12 h-12 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-14 px-8 pb-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] flex items-center gap-2">
                                {displayName}
                                {displayRole === 'pro' && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 uppercase">PRO</span>
                                )}
                            </h2>
                            <p className="text-[rgb(var(--color-text-secondary))] flex items-center gap-2 mt-1">
                                <Calendar className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
                                Member since {formatDate(displayJoinDate || '')}
                            </p>
                        </div>

                        {isOwnProfile ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                                        Display Name
                                    </label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg text-[rgb(var(--color-text-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative opacity-60">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
                                        <input
                                            type="email"
                                            value={user?.email}
                                            disabled
                                            className="w-full pl-10 pr-4 py-2 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg text-[rgb(var(--color-text-secondary))] cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2 flex items-center gap-4">
                                    <Button type="submit" disabled={loading}>
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                    {message && (
                                        <span className={`text-sm ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
                                            {message}
                                        </span>
                                    )}
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6 border-t border-[rgb(var(--color-border))] pt-6 mt-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-lg bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))]">
                                        <div className="text-xs text-[rgb(var(--color-text-secondary))] mb-1">Architect Level</div>
                                        <div className="text-sm font-semibold text-[rgb(var(--color-text-primary))] capitalize">
                                            {displayRole === 'pro' ? 'Elite Architect' : 'Standard Architect'}
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-lg bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))]">
                                        <div className="text-xs text-[rgb(var(--color-text-secondary))] mb-1">Status</div>
                                        <div className="text-sm font-semibold text-emerald-500 flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                                            Active Architect
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Credentials/Subscription Details */}
                <div className="bg-[rgb(var(--color-card))] rounded-xl border border-[rgb(var(--color-border))] overflow-hidden shadow-sm h-fit">
                    {isOwnProfile ? (
                        <div className="p-6 bg-gradient-to-br from-[rgb(var(--color-bg-secondary))] to-[rgb(var(--color-card))]">
                            <h3 className="text-lg font-bold text-[rgb(var(--color-text-primary))] mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-[rgb(var(--color-primary))]" />
                                Subscription
                            </h3>

                            <div className="mb-6">
                                <div className="text-sm text-[rgb(var(--color-text-secondary))] mb-1">Current Plan</div>
                                <div className={`text-2xl font-bold capitalize flex items-center gap-2 ${user?.role === 'pro' ? 'text-[#B58863]' : 'text-[rgb(var(--color-text-primary))]'}`}>
                                    {user?.role} Plan
                                    {user?.role === 'pro' && <Badge variant="primary">Active</Badge>}
                                </div>
                            </div>

                            {!ENABLE_PRO_PLANS ? (
                                <div className="space-y-4">
                                    <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                                        Pro subscription plans are currently disabled. Enjoy full access to all standard features!
                                    </p>
                                </div>
                            ) : user?.role === 'pro' ? (
                                <div className="space-y-4">
                                    <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                                        Your subscription is managed securely. Contact support for details.
                                    </p>
                                    <Button variant="secondary" className="w-full" onClick={() => alert('Manage subscription coming soon!')}>
                                        Manage Subscription
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                                        Upgrade to Pro to unlock unlimited AI reviews, advanced components, and more.
                                    </p>
                                    <Button variant="primary" className="w-full" onClick={() => navigate('/pricing')}>
                                        Upgrade to Pro
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-6 bg-gradient-to-br from-[rgb(var(--color-bg-secondary))] to-[rgb(var(--color-card))]">
                            <h3 className="text-lg font-bold text-[rgb(var(--color-text-primary))] mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-[rgb(var(--color-primary))]" />
                                Credentials
                            </h3>

                            <div className="space-y-4 text-sm text-[rgb(var(--color-text-secondary))]">
                                <p>
                                    This profile lists public achievements and system design scores compiled from live canvas evaluations.
                                </p>
                                <div className="pt-2 border-t border-[rgb(var(--color-border))]">
                                    <div className="font-semibold text-[rgb(var(--color-text-primary))] mb-1 flex items-center gap-1.5">
                                        <Zap className="w-4 h-4 text-[#B58863]" /> Verified Architect
                                    </div>
                                    <p className="text-xs">
                                        All score stats are generated automatically and verified by our system design evaluator.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaderboardApi, type LeaderboardUser, type UserRank } from '../api/leaderboard.api';
import { useAppStore } from '../store';
import { Trophy, Medal, Star, Crown } from 'lucide-react';
import { SEO } from '../components/SEO';

const LeaderboardPage: React.FC = () => {
    const { user } = useAppStore();
    const navigate = useNavigate();
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
    const [userRank, setUserRank] = useState<UserRank | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [leaderboardData, rankData] = await Promise.all([
                    leaderboardApi.getLeaderboard(50), // Get top 50
                    user ? leaderboardApi.getUserRank().catch(() => null) : Promise.resolve(null)
                ]);

                // @ts-ignore
                setLeaderboard(leaderboardData.data || leaderboardData);
                if (rankData) {
                    // @ts-ignore
                    setUserRank(rankData.data || rankData);
                }
            } catch (error) {
                console.error('Failed to fetch leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0:
                return <Crown className="w-6 h-6 text-yellow-500" />;
            case 1:
                return <Medal className="w-6 h-6 text-gray-400" />;
            case 2:
                return <Medal className="w-6 h-6 text-amber-700" />;
            default:
                return <span className="text-gray-500 dark:text-gray-400 font-bold w-6 text-center">{index + 1}</span>;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const isUserInLeaderboard = leaderboard.some(player => player.userId === user?.id);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <SEO 
                title="System Design Leaderboard & Rankings" 
                description="See the top system design architects and high scores in the Infralab community." 
            />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <Trophy className="w-8 h-8 text-yellow-500" />
                        Global Leaderboard
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Top system architects ranked by design quality and problem solving.
                    </p>
                </div>

                {user && userRank && (
                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center gap-6">
                        <div className="text-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Your Rank</div>
                            <div className="text-3xl font-bold text-primary">#{userRank.rank}</div>
                        </div>
                        <div className="h-10 w-px bg-gray-300 dark:bg-gray-700"></div>
                        <div className="text-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Total Score</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{userRank.totalScore}</div>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">Rank</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Architect</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Problems Solved</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg. Score</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {leaderboard.map((player, index) => (
                                <tr
                                    key={player.userId}
                                    onClick={() => navigate(`/profile/${player.userId}`)}
                                    className={`
                                        cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
                                        ${user?.id === player.userId ? 'bg-primary/5 dark:bg-primary/10 font-semibold' : ''}
                                    `}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800">
                                            {getRankIcon(index)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                                {player.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                    {player.name}
                                                    {player.role === 'pro' && (
                                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900">PRO</span>
                                                    )}
                                                    {user?.id === player.userId && (
                                                        <span className="px-2 py-0.5 rounded-full text-xs bg-primary/20 text-primary font-medium">You</span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    System Architect
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#B58863]/10 text-[#B58863] border border-[#B58863]/20">
                                            {player.problemsSolved}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex items-center justify-center gap-1 font-medium text-gray-700 dark:text-gray-300">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            {player.averageScore}%
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="text-lg font-bold text-primary">
                                            {player.totalScore}
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {user && userRank && !isUserInLeaderboard && (
                                <>
                                    <tr className="bg-gray-50 dark:bg-gray-900/30">
                                        <td colSpan={5} className="px-6 py-2 text-center text-xs text-gray-400 dark:text-gray-500 font-medium tracking-widest select-none">
                                            •••
                                        </td>
                                    </tr>
                                    <tr
                                        key={user.id}
                                        onClick={() => navigate(`/profile/${user.id}`)}
                                        className="cursor-pointer bg-primary/10 dark:bg-primary/20 hover:bg-primary/15 transition-colors border-t border-primary/20 font-semibold"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">
                                                {userRank.rank}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                        {user.name}
                                                        {user.role === 'pro' && (
                                                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900">PRO</span>
                                                        )}
                                                        <span className="px-2 py-0.5 rounded-full text-xs bg-primary/20 text-primary font-medium">You</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        System Architect
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#B58863]/10 text-[#B58863] border border-[#B58863]/20">
                                                {userRank.problemsSolved}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center gap-1 font-medium text-gray-700 dark:text-gray-300">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                {userRank.averageScore}%
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="text-lg font-bold text-primary">
                                                {userRank.totalScore}
                                            </div>
                                        </td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>

                    {leaderboard.length === 0 && (
                        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                            No ranked players yet. Be the first to solve a problem!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;

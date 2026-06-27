import React, { useEffect, useState } from 'react';
import { ArrowRight, Clock, Plus, Trophy, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { getUserDesigns } from '../api/designs.api';
import { getProblems } from '../api/problems.api';
import { leaderboardApi, type UserRank } from '../api/leaderboard.api';
import type { Design, Problem } from '../types';

export const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const [recentDesigns, setRecentDesigns] = useState<Design[]>([]);
    const [problemsMap, setProblemsMap] = useState<Record<string, Problem>>({});
    const [userRank, setUserRank] = useState<UserRank | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [designs, problems, rankData] = await Promise.all([
                    getUserDesigns(),
                    getProblems(),
                    leaderboardApi.getUserRank().catch(() => null)
                ]);

                // @ts-ignore
                setUserRank(rankData?.data || rankData);

                // Sort designs by updatedAt desc and take top 5
                const sortedDesigns = designs.sort((a: Design, b: Design) =>
                    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                ).slice(0, 5);

                setRecentDesigns(sortedDesigns);

                const pMap: Record<string, Problem> = {};
                problems.forEach((p: Problem) => {
                    pMap[p.id] = p;
                });
                setProblemsMap(pMap);
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-6 space-y-6">
            {/* Welcome Section */}
            <div>
                <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-2">
                    Welcome back!
                </h2>
                <p className="text-[rgb(var(--color-text-secondary))]">
                    Continue your system design journey
                </p>
            </div>

            {/* Stats Overview */}
            {userRank && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="flex items-center gap-4 p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
                        <div className="p-3 bg-amber-500/20 rounded-full text-amber-600 dark:text-amber-400">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] font-medium">Global Rank</p>
                            <p className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">#{userRank.rank}</p>
                        </div>
                    </Card>
                    <Card className="flex items-center gap-4 p-4 bg-gradient-to-br from-[rgb(var(--color-primary))]/10 to-[rgb(var(--color-primary))]/5 border-[rgb(var(--color-primary))]/20">
                        <div className="p-3 bg-[rgb(var(--color-primary))]/20 rounded-full text-[rgb(var(--color-primary))]">
                            <Star className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] font-medium">Total Score</p>
                            <p className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">{userRank.totalScore}</p>
                        </div>
                    </Card>
                </div>
            )}

            {/* Quick Start */}
            <Card>
                <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))] mb-4">
                    Quick Start
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-app bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))] transition-all cursor-pointer">
                        <h4 className="font-medium text-[rgb(var(--color-text-primary))] mb-2">
                            Start New Problem
                        </h4>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-3">
                            Choose from our collection of real-world system design problems
                        </p>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/problems')}>
                            Browse Problems <ArrowRight className="w-4 h-4 ml-1 inline" />
                        </Button>
                    </div>
                    <div className="p-4 rounded-app bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))] transition-all cursor-pointer">
                        <h4 className="font-medium text-[rgb(var(--color-text-primary))] mb-2">
                            Practice Mode
                        </h4>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-3">
                            Timed practice sessions to simulate real interviews
                        </p>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/practice')}>
                            Start Practice <Clock className="w-4 h-4 ml-1 inline" />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Recent Designs */}
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
                        Recent Designs
                    </h3>
                    {recentDesigns.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={() => navigate('/designs')}>
                            View All
                        </Button>
                    )}
                </div>

                {loading ? (
                    <div className="py-8 text-center text-[rgb(var(--color-text-secondary))]">
                        Loading designs...
                    </div>
                ) : recentDesigns.length > 0 ? (
                    <div className="space-y-3">
                        {recentDesigns.map((design) => {
                            const problemIdStr = typeof design.problemId === 'object' && design.problemId
                                ? (design.problemId as any)._id || (design.problemId as any).id
                                : design.problemId;
                            const problem = problemsMap[problemIdStr];
                            return (
                                <div
                                    key={design.id}
                                    className="p-4 rounded-app bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))] transition-all cursor-pointer"
                                    onClick={() => navigate(`/workspace/${problemIdStr}`)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium text-[rgb(var(--color-text-primary))]">
                                                {design.name || problem?.title || 'Untitled Design'}
                                            </h4>
                                            <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
                                                {problem?.title ? `${problem.title} • ` : ''}Last edited {new Date(design.updatedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {problem && (
                                            <Badge
                                                variant={
                                                    (problem.difficulty || '').toLowerCase() === 'easy'
                                                        ? 'success'
                                                        : (problem.difficulty || '').toLowerCase() === 'medium'
                                                            ? 'warning'
                                                            : 'error'
                                                }
                                            >
                                                {problem.difficulty}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-12 text-center border-2 border-dashed border-[rgb(var(--color-border))] rounded-xl">
                        <div className="w-12 h-12 bg-[rgb(var(--color-surface))] rounded-full flex items-center justify-center mx-auto mb-3">
                            <Plus className="w-6 h-6 text-[rgb(var(--color-text-secondary))]" />
                        </div>
                        <h4 className="text-[rgb(var(--color-text-primary))] font-medium mb-1">No designs yet</h4>
                        <p className="text-[rgb(var(--color-text-secondary))] text-sm mb-4">Start your first system design problem</p>
                        <Button variant="primary" size="sm" onClick={() => navigate('/problems')}>
                            Browse Problems
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
};

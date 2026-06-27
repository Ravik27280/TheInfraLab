import api from './client';

export interface LeaderboardUser {
    userId: string;
    name: string;
    email: string;
    profileImage?: string;
    totalScore: number;
    averageScore: number;
    problemsSolved: number;
    role: 'free' | 'pro';
}

export interface UserRank {
    rank: number;
    totalScore: number;
    averageScore: number;
    problemsSolved: number;
}

export const leaderboardApi = {
    getLeaderboard: async (limit: number = 20) => {
        const response = await api.get<{ data: LeaderboardUser[] }>(`/leaderboard?limit=${limit}`);
        return response.data;
    },

    getUserRank: async () => {
        const response = await api.get<{ data: UserRank }>('/leaderboard/rank');
        return response.data;
    }
};

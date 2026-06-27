import apiClient from './client';
import type { Problem } from '../types';

export interface ProblemsResponse {
    success: boolean;
    data: Problem[];
    message: string;
}

export interface ProblemResponse {
    success: boolean;
    data: Problem;
    message: string;
}

/**
 * Get all problems (filtered by user role)
 */
export const getProblems = async (): Promise<Problem[]> => {
    const response = await apiClient.get<ProblemsResponse>('/problems');
    return response.data.data;
};

/**
 * Get a specific problem by ID
 */
export const getProblem = async (id: string): Promise<Problem> => {
    const response = await apiClient.get<ProblemResponse>(`/problems/${id}`);
    return response.data.data;
};

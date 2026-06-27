import apiClient from './client';

export interface FeedbackInput {
    rating: number;
    comment: string;
    name?: string;
    email?: string;
}

export interface FeedbackItem {
    id: string;
    name: string;
    rating: number;
    comment: string;
    createdAt: string;
}

/**
 * Submit feedback to backend
 */
export const submitFeedback = async (data: FeedbackInput): Promise<{ success: boolean; data: FeedbackItem }> => {
    const response = await apiClient.post<{ success: boolean; data: FeedbackItem }>('/feedback', data);
    return response.data;
};

/**
 * Fetch featured/top feedback items for landing page
 */
export const getFeaturedFeedback = async (): Promise<FeedbackItem[]> => {
    const response = await apiClient.get<{ success: boolean; data: FeedbackItem[] }>('/feedback/featured');
    return response.data.data;
};

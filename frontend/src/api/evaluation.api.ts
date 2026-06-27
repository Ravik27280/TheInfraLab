import apiClient from './client';
import type { FeedbackResult } from '../types';

export interface EvaluationRequest {
    problemId: string;
    nodes: any[];
    edges: any[];
    designId?: string | null;
}

export interface EvaluationResponse {
    success: boolean;
    data: FeedbackResult;
    message: string;
}

/**
 * Evaluate a design using AI
 */
export const evaluateDesign = async (data: EvaluationRequest): Promise<FeedbackResult> => {
    const response = await apiClient.post<EvaluationResponse>('/evaluate', data);
    return response.data.data;
};

import apiClient from './client';
import type { Design, FlowNode, FlowEdge } from '../types';

export interface SaveDesignRequest {
    problemId: string;
    name?: string;
    nodes: FlowNode[];
    edges: FlowEdge[];
}

export interface DesignResponse {
    success: boolean;
    data: Design;
    message: string;
}

export interface DesignsResponse {
    success: boolean;
    data: Design[];
    message: string;
}

/**
 * Save a new design
 */
export const saveDesign = async (data: SaveDesignRequest): Promise<Design> => {
    const response = await apiClient.post<DesignResponse>('/designs', data);
    return response.data.data;
};

/**
 * Update an existing design
 */
export const updateDesign = async (id: string, data: Partial<SaveDesignRequest>): Promise<Design> => {
    const response = await apiClient.put<DesignResponse>(`/designs/${id}`, data);
    return response.data.data;
};

/**
 * Get all designs for the current user
 */
export const getUserDesigns = async (): Promise<Design[]> => {
    const response = await apiClient.get<DesignsResponse>('/designs/user');
    return response.data.data;
};

/**
 * Get a specific design by ID
 */
export const getDesign = async (id: string): Promise<Design> => {
    const response = await apiClient.get<DesignResponse>(`/designs/${id}`);
    return response.data.data;
};

/**
 * Get design by problem ID for current user
 */
export const getDesignByProblemId = async (problemId: string): Promise<Design | null> => {
    try {
        const response = await apiClient.get<DesignResponse>(`/designs/problem/${problemId}`);
        return response.data.data;
    } catch (error: any) {
        // If no design found (404), return null
        if (error?.response?.status === 404) {
            return null;
        }
        throw error;
    }
};

/**
 * Delete a specific design by ID
 */
export const deleteDesign = async (id: string): Promise<void> => {
    await apiClient.delete(`/designs/${id}`);
};

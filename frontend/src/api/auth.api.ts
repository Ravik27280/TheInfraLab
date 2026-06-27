import apiClient from './client';

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    data: {
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: 'free' | 'pro';
        };
    };
    message: string;
}

/**
 * Register a new user
 */
export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
};

/**
 * Login user
 */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
};

/**
 * Login with Google
 */
export const googleLogin = async (credential: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/google', { credential });
    return response.data;
};

/**
 * Upgrade to Pro
 */
export const upgradeToPro = async (): Promise<{ success: boolean; user: any; message: string }> => {
    const response = await apiClient.post('/payment/upgrade');
    return response.data.data;
};

/**
 * Logout user
 */
export const logout = async (): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post<{ success: boolean; message: string }>('/auth/logout');
    return response.data;
};

/**
 * Verify email code
 */
export const verifyEmail = async (email: string, code: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/verify-email', { email, code });
    return response.data;
};

/**
 * Resend email verification code
 */
export const resendVerification = async (email: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post<{ success: boolean; message: string }>('/auth/resend-verification', { email });
    return response.data;
};

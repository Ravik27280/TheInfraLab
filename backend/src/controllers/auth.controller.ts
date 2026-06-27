import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response.util';

export class AuthController {
    async register(req: Request, res: Response): Promise<void> {
        try {
            const result = await authService.register(req.body);
            // Do not issue cookie yet (user must verify email)
            sendSuccess(res, result, 'User registered successfully. Please verify your email.', 201);
        } catch (error: any) {
            if (error.isUnverified) {
                res.status(400).json({
                    success: false,
                    isUnverified: true,
                    email: error.email,
                    error: error.message,
                });
                return;
            }
            sendError(res, error.message, 400);
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const result = await authService.login(req.body);
            res.cookie('token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            sendSuccess(res, result, 'Login successful');
        } catch (error: any) {
            if (error.isUnverified) {
                res.status(403).json({
                    success: false,
                    isUnverified: true,
                    email: req.body.email,
                    error: error.message,
                });
                return;
            }
            sendError(res, error.message, 401);
        }
    }

    async googleLogin(req: Request, res: Response): Promise<void> {
        try {
            const { credential } = req.body;
            if (!credential) {
                sendError(res, 'Credential is required', 400);
                return;
            }
            const result = await authService.googleLogin(credential);
            res.cookie('token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            sendSuccess(res, result, 'Google login successful');
        } catch (error: any) {
            sendError(res, error.message, 401);
        }
    }

    async logout(req: Request, res: Response): Promise<void> {
        try {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            sendSuccess(res, null, 'Logged out successfully');
        } catch (error: any) {
            sendError(res, error.message, 500);
        }
    }
    async updateProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user.userId;
            const { name } = req.body;
            const result = await authService.updateProfile(userId, { name });
            sendSuccess(res, result, 'Profile updated successfully');
        } catch (error: any) {
            sendError(res, error.message, 400);
        }
    }

    async upgradeToPro(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user.userId;
            const result = await authService.upgradeToPro(userId);
            sendSuccess(res, result, 'Upgraded to Pro successfully');
        } catch (error: any) {
            sendError(res, error.message, 400);
        }
    }

    async getUserStats(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user.userId;
            const result = await authService.getUserStats(userId);
            sendSuccess(res, result, 'User stats retrieved successfully');
        } catch (error: any) {
            sendError(res, error.message, 400);
        }
    }

    async getPublicProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId;
            if (!userId || typeof userId !== 'string') {
                sendError(res, 'User ID is required', 400);
                return;
            }
            const result = await authService.getPublicProfile(userId);
            sendSuccess(res, result, 'User profile retrieved successfully');
        } catch (error: any) {
            sendError(res, error.message, 404);
        }
    }

    async verifyEmail(req: Request, res: Response): Promise<void> {
        try {
            const { email, code } = req.body;
            if (!email || !code) {
                sendError(res, 'Email and verification code are required', 400);
                return;
            }
            const result = await authService.verifyEmail(email, code);
            res.cookie('token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            sendSuccess(res, result, 'Email verified successfully');
        } catch (error: any) {
            sendError(res, error.message, 400);
        }
    }

    async resendVerification(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            if (!email) {
                sendError(res, 'Email is required', 400);
                return;
            }
            const result = await authService.resendVerificationCode(email);
            sendSuccess(res, result, 'Verification code resent successfully');
        } catch (error: any) {
            sendError(res, error.message, 400);
        }
    }
}

export default new AuthController();

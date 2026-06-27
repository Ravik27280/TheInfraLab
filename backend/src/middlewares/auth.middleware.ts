import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';
import { sendError } from '../utils/response.util';
import User from '../models/User.model';

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let token: string | undefined;

        // 1. Try Authorization header
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        // 2. Try cookie header if no token found in authorization header
        if (!token && req.headers.cookie) {
            const cookies = req.headers.cookie.split(';').reduce((acc, cookie) => {
                const [key, val] = cookie.trim().split('=');
                if (key) acc[key] = val;
                return acc;
            }, {} as Record<string, string>);
            token = cookies.token;
        }

        if (!token) {
            sendError(res, 'No token provided', 401, 'Authentication required');
            return;
        }

        try {
            const decoded = verifyToken(token);

            // Fetch user details
            const user = await User.findById(decoded.userId).select('email role isEmailVerified');

            if (!user) {
                sendError(res, 'User not found', 401);
                return;
            }

            // Enforce email verification (except for me and logout endpoints)
            if (user.isEmailVerified === false && req.path !== '/me' && req.path !== '/logout') {
                sendError(res, 'Email not verified', 403, 'Please verify your email address to continue.');
                return;
            }

            // Attach user to request object
            req.user = {
                userId: decoded.userId,
                email: user.email,
                role: user.role,
            };

            next();
        } catch (error) {
            sendError(res, 'Invalid or expired token', 401);
            return;
        }
    } catch (error) {
        sendError(res, 'Authentication failed', 500);
    }
};

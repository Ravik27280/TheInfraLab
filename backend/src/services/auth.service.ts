import User from '../models/User.model';
import Design from '../models/Design.model';
import Problem from '../models/Problem.model';
import { generateToken } from '../utils/jwt.util';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import { IUser } from '../types';
import { env } from '../config/env';
import { ENABLE_PRO_PLANS } from '../config/constants';
import { sendVerificationEmail } from '../utils/email.util';

export class AuthService {
    async register(data: RegisterInput) {
        // Check if user already exists
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            if (!existingUser.isEmailVerified) {
                if (process.env.BYPASS_EMAIL_VERIFICATION === 'true') {
                    existingUser.isEmailVerified = true;
                    await existingUser.save();
                    throw new Error('Email already registered. You can now sign in.');
                }
                // User is not verified, regenerate and resend code
                const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
                existingUser.emailVerificationCode = verificationCode;
                existingUser.emailVerificationExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
                await existingUser.save();

                const emailSent = await sendVerificationEmail(existingUser.email, existingUser.name, verificationCode);
                if (!emailSent) {
                    throw new Error('Failed to send verification email. Please check your SMTP / SMTP_FROM settings.');
                }

                const error = new Error('Email already registered but not verified. A new verification code has been sent.') as any;
                error.isUnverified = true;
                error.email = existingUser.email;
                throw error;
            }
            throw new Error('Email already registered');
        }

        // Generate verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name || data.email)}`;

        // Create new user
        const user = await User.create({
            name: data.name,
            email: data.email,
            password: data.password,
            avatar: avatarUrl,
            isEmailVerified: process.env.BYPASS_EMAIL_VERIFICATION === 'true',
            emailVerificationCode: verificationCode,
            emailVerificationExpires: verificationCodeExpires,
        });

        // Send verification email (will gracefully log to console if SMTP is unconfigured)
        if (process.env.BYPASS_EMAIL_VERIFICATION !== 'true') {
            const emailSent = await sendVerificationEmail(user.email, user.name, verificationCode);
            if (!emailSent) {
                // Delete user from database if email fails so they can retry after updating settings
                await User.deleteOne({ _id: user._id });
                throw new Error('Failed to send verification email. Please check your SMTP / SMTP_FROM settings.');
            }
        }

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                isEmailVerified: user.isEmailVerified,
                createdAt: user.createdAt,
            },
            message: 'Verification code sent to your email.'
        };
    }

    async login(data: LoginInput) {
        // Find user and include password and verification fields
        const user = await User.findOne({ email: data.email }).select('+password +emailVerificationCode +emailVerificationExpires');
        if (!user) {
            throw new Error('No user found with this email. Please check your email or click "Sign up" below to create an account.');
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(data.password);
        if (!isPasswordValid) {
            throw new Error('Incorrect password. Please try again.');
        }

        // Check if email is verified
        if (!user.isEmailVerified) {
            const error = new Error('Email not verified. Please verify your email first.') as any;
            error.isUnverified = true;
            throw error;
        }

        // Generate JWT token
        const token = generateToken(user._id.toString());

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                isEmailVerified: user.isEmailVerified,
                createdAt: user.createdAt,
            },
            token,
        };
    }

    async googleLogin(credential: string) {
        // Use the access token to get user info directly
        try {
            // Verify access token details using tokeninfo endpoint to check audience/client ID
            const tokenInfoResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${credential}`);
            if (!tokenInfoResponse.ok) {
                throw new Error('Failed to verify Google token integrity');
            }

            interface GoogleTokenInfo {
                issued_to?: string;
                audience?: string;
                azp?: string;
                aud?: string;
                email: string;
                verified_email?: boolean;
                email_verified?: string;
            }
            const tokenInfo = await tokenInfoResponse.json() as GoogleTokenInfo;

            // Check client ID match to prevent token substitution attacks
            if (env.GOOGLE_CLIENT_ID) {
                const clientID = env.GOOGLE_CLIENT_ID;
                const isAudMatch = 
                    tokenInfo.issued_to === clientID || 
                    tokenInfo.audience === clientID ||
                    tokenInfo.azp === clientID ||
                    tokenInfo.aud === clientID;
                if (!isAudMatch) {
                    throw new Error('Google token client ID mismatch');
                }
            } else {
                console.warn('WARNING: GOOGLE_CLIENT_ID is not configured. Skipping audience validation.');
            }

            const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${credential}` },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch Google user profile info');
            }

            interface GoogleTokenPayload {
                email: string;
                name: string;
                picture: string;
                given_name: string;
                sub: string;
            }

            const payload = await response.json() as GoogleTokenPayload;

            if (!payload.email) {
                throw new Error('Invalid Google token payload');
            }

            const { email, name, picture } = payload;

            // Check if user exists
            let user = await User.findOne({ email });

            if (!user) {
                // Create new user
                const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
                const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || email)}`;

                user = await User.create({
                    name: name || payload.given_name || 'User',
                    email,
                    password: randomPassword,
                    avatar: avatarUrl,
                    role: ENABLE_PRO_PLANS ? 'pro' : 'free', // Default role
                    isEmailVerified: true, // Auto-verified via Google
                });
            } else if (!user.isEmailVerified || !user.avatar) {
                // If they exist but were not verified, Google login verifies them
                user.isEmailVerified = true;
                user.emailVerificationCode = undefined;
                user.emailVerificationExpires = undefined;
                if (!user.avatar) {
                    user.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || user.email)}`;
                }
                await user.save();
            }

            // Generate JWT token
            const token = generateToken(user._id.toString());

            return {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                    createdAt: user.createdAt,
                },
                token,
            };
        } catch (error) {
            console.error('Google Auth Error:', error);
            throw new Error('Invalid Google token');
        }
    }
    async updateProfile(userId: string, data: { name?: string }): Promise<IUser> {
        const user = await User.findByIdAndUpdate(userId, data, { new: true });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async upgradeToPro(userId: string): Promise<IUser> {
        if (!ENABLE_PRO_PLANS) {
            throw new Error('Pro subscription upgrades are currently disabled');
        }
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        user.role = 'pro';
        user.subscriptionStatus = 'active';
        await user.save();

        return user;
    }

    async getUserStats(userId: string): Promise<any> {
        const designsCount = await Design.countDocuments({ userId });

        // Find designs with feedback
        const designs = await Design.find({ userId, 'evaluationResult.score': { $exists: true } });

        const solvedCount = designs.length;
        const totalScore = designs.reduce((acc: number, curr: any) => acc + (curr.evaluationResult?.score || 0), 0);
        const averageScore = solvedCount > 0 ? Math.round(totalScore / solvedCount) : 0;

        return {
            designsCount,
            problemsSolved: solvedCount,
            averageScore
        };
    }

    async getPublicProfile(userId: string): Promise<any> {
        const user = await User.findById(userId).select('name role avatar createdAt');
        if (!user) {
            throw new Error('User not found');
        }

        const stats = await this.getUserStats(userId);

        return {
            id: user._id.toString(),
            name: user.name,
            role: user.role,
            avatar: user.avatar,
            createdAt: user.createdAt,
            stats
        };
    }

    async verifyEmail(email: string, code: string) {
        const user = await User.findOne({ email }).select('+emailVerificationCode +emailVerificationExpires');
        if (!user) {
            throw new Error('User not found');
        }
        if (user.isEmailVerified) {
            throw new Error('Email is already verified');
        }
        if (!user.emailVerificationCode || user.emailVerificationCode !== code) {
            throw new Error('Invalid verification code');
        }
        if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
            throw new Error('Verification code has expired');
        }

        user.isEmailVerified = true;
        user.emailVerificationCode = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        const token = generateToken(user._id.toString());
        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                isEmailVerified: user.isEmailVerified,
                createdAt: user.createdAt,
            },
            token
        };
    }

    async resendVerificationCode(email: string) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }
        if (user.isEmailVerified) {
            throw new Error('Email is already verified');
        }

        if (process.env.BYPASS_EMAIL_VERIFICATION === 'true') {
            user.isEmailVerified = true;
            await user.save();
            return { success: true, message: 'Email verified successfully (bypassed)' };
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        user.emailVerificationCode = verificationCode;
        user.emailVerificationExpires = verificationCodeExpires;
        await user.save();

        // Send verification email (will gracefully log to console if SMTP is unconfigured)
        await sendVerificationEmail(user.email, user.name, verificationCode);

        return { success: true, message: 'Verification code resent' };
    }
}

export default new AuthService();

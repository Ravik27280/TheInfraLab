import { Request, Response } from 'express';
import Feedback from '../models/Feedback.model';
import User from '../models/User.model';
import { sendSuccess, sendError } from '../utils/response.util';

export const createFeedback = async (req: Request, res: Response) => {
    try {
        const { rating, comment, name, email } = req.body;

        if (!rating || !comment) {
            return sendError(res, 'Rating and comment are required', 400);
        }

        // Auto-fill from authenticated user if available
        const userId = req.user?.userId;
        let submitName = name;
        let submitEmail = email;

        if (userId) {
            const user = await User.findById(userId);
            if (user) {
                submitName = name || user.name;
                submitEmail = email || user.email;
            }
        }

        submitName = submitName || 'Anonymous Architect';
        submitEmail = submitEmail || 'anonymous@example.com';

        const feedback = await Feedback.create({
            userId,
            name: submitName,
            email: submitEmail,
            rating: Number(rating),
            comment,
            isFeatured: false, // Must be marked as featured by admins to show on homepage
        });

        return sendSuccess(res, feedback, 'Feedback submitted successfully', 201);
    } catch (error: any) {
        console.error('Create feedback error:', error);
        return sendError(res, error.message || 'Failed to submit feedback', 500);
    }
};

export const getFeaturedFeedback = async (req: Request, res: Response) => {
    try {
        // Fetch featured feedback, or fallback to high rating if none marked as featured
        let feedbacks = await Feedback.find({ isFeatured: true })
            .select('name rating comment createdAt')
            .sort({ createdAt: -1 })
            .limit(10);

        if (feedbacks.length === 0) {
            // Fallback: get top-rated feedbacks
            feedbacks = await Feedback.find({ rating: { $gte: 4 } })
                .select('name rating comment createdAt')
                .sort({ rating: -1, createdAt: -1 })
                .limit(5);
        }

        return sendSuccess(res, feedbacks, 'Featured feedback retrieved successfully');
    } catch (error: any) {
        console.error('Get featured feedback error:', error);
        return sendError(res, error.message || 'Failed to retrieve feedback', 500);
    }
};

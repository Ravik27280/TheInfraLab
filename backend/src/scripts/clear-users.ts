import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model';
import Design from '../models/Design.model';
import Feedback from '../models/Feedback.model';
import { logger } from '../utils/logger.util';

dotenv.config();

const clearUsers = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/infralab';
        logger.info('Connecting to MongoDB...');
        await mongoose.connect(uri);
        logger.success('Connected to MongoDB');

        // Delete all users
        logger.info('Clearing users...');
        const userDeleteResult = await User.deleteMany({});
        logger.success(`Cleared all users from database (deleted ${userDeleteResult.deletedCount} users)`);

        // Clear associated designs and feedback to maintain database consistency
        logger.info('Clearing user-created designs...');
        const designDeleteResult = await Design.deleteMany({});
        logger.success(`Cleared all designs from database (deleted ${designDeleteResult.deletedCount} designs)`);

        logger.info('Clearing feedback records...');
        const feedbackDeleteResult = await Feedback.deleteMany({});
        logger.success(`Cleared all feedback from database (deleted ${feedbackDeleteResult.deletedCount} feedback records)`);

        await mongoose.connection.close();
        logger.success('Database connection closed successfully.');
        process.exit(0);
    } catch (error) {
        logger.error('❌ Error clearing users:', error);
        process.exit(1);
    }
};

clearUsers();

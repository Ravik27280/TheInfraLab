import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import app from './app';
import { env } from './config/env';
import { connectDatabase } from './config/database';
import { logger } from './utils/logger.util';
import User from './models/User.model';
import { ENABLE_PRO_PLANS } from './config/constants';

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDatabase();

        // Migrate users between free and pro based on the feature toggle
        try {
            if (ENABLE_PRO_PLANS) {
                const result = await User.updateMany({ role: 'free' }, { role: 'pro' });
                if (result.modifiedCount > 0) {
                    logger.success(`Migrated ${result.modifiedCount} existing free users to pro.`);
                }
            } else {
                const result = await User.updateMany({ role: 'pro' }, { role: 'free' });
                if (result.modifiedCount > 0) {
                    logger.success(`Migrated ${result.modifiedCount} existing pro users to free.`);
                }
            }
        } catch (migrationError) {
            logger.error('Failed to migrate existing users:', migrationError);
        }

        // Start Express server
        const server = app.listen(env.PORT, () => {
            logger.success(`Server running on port ${env.PORT}`);
            logger.info(`Environment: ${env.NODE_ENV}`);
            logger.info(`CORS Origin: ${env.CORS_ORIGIN}`);
        });

        // Graceful shutdown
        const gracefulShutdown = () => {
            logger.info('Received shutdown signal, closing server gracefully...');
            server.close(() => {
                logger.success('Server closed');
                process.exit(0);
            });

            // Force close after 10 seconds
            setTimeout(() => {
                logger.error('Forcing shutdown');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

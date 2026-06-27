export const APP_NAME = 'Infralab';

export const ENABLE_PRO_PLANS = false;

export const USER_ROLES = {
    FREE: 'free',
    PRO: 'pro',
} as const;

export const SUBSCRIPTION_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    CANCELLED: 'cancelled',
} as const;

export const DIFFICULTY_LEVELS = {
    EASY: 'Easy',
    MEDIUM: 'Medium',
    HARD: 'Hard',
} as const;

export const RATE_LIMIT_CONFIG = {
    GENERAL: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 500,
    },
    AUTH: {
        windowMs: 15 * 60 * 1000,
        max: 20,
    },
    EVALUATION: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 1000,
    },
};

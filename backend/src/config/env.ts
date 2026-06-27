import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
    PORT: number;
    NODE_ENV: string;
    MONGODB_URI: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    CORS_ORIGIN: string;
    GOOGLE_CLIENT_ID: string;
    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_USER: string;
    SMTP_PASS: string;
    SMTP_FROM: string;
}

const getEnvVariable = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};

export const env: EnvConfig = {
    PORT: parseInt(getEnvVariable('PORT', '5000'), 10),
    NODE_ENV: getEnvVariable('NODE_ENV', 'development'),
    MONGODB_URI: getEnvVariable('MONGODB_URI'),
    JWT_SECRET: getEnvVariable('JWT_SECRET'),
    JWT_EXPIRES_IN: getEnvVariable('JWT_EXPIRES_IN', '7d'),
    CORS_ORIGIN: getEnvVariable('CORS_ORIGIN', 'http://localhost:5173'),
    GOOGLE_CLIENT_ID: getEnvVariable('GOOGLE_CLIENT_ID', ''),
    SMTP_HOST: process.env.SMTP_HOST || '',
    SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASS: process.env.SMTP_PASS || '',
    SMTP_FROM: process.env.SMTP_FROM || 'Infralab <no-reply@infralab.com>',
};

import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from './logger.util';

let transporter: nodemailer.Transporter | null = null;

// Lazily initialize transporter if SMTP is configured
const getTransporter = (): nodemailer.Transporter | null => {
    if (transporter) return transporter;

    if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
        logger.warn('⚠️  SMTP parameters (SMTP_HOST, SMTP_USER, SMTP_PASS) are not configured. Emails will be logged to the console instead.');
        return null;
    }

    try {
        transporter = nodemailer.createTransport({
            host: env.SMTP_HOST,
            port: env.SMTP_PORT,
            secure: env.SMTP_PORT === 465, // True for 465, false for other ports
            auth: {
                user: env.SMTP_USER,
                pass: env.SMTP_PASS,
            },
        });
        logger.info('📧 Mail transporter initialized successfully');
        return transporter;
    } catch (error) {
        logger.error('❌ Failed to initialize Mail Transporter:', error);
        return null;
    }
};

/**
 * Send a verification code to a user's email address.
 */
export const sendVerificationEmail = async (
    email: string,
    name: string,
    code: string
): Promise<boolean> => {
    // Standard backup console logging for developer convenience
    console.log(`\n==================================================`);
    console.log(`[Verification Code Notification for ${email}]`);
    console.log(`Code: ${code}`);
    console.log(`==================================================\n`);

    const mailTransporter = getTransporter();
    if (!mailTransporter) {
        logger.info(`📝 [Simulation Mode] Skipped sending email to ${email}. Code was logged to console.`);
        return false;
    }

    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - Infralab</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #10232A;
                color: #A79E9C;
                margin: 0;
                padding: 0;
            }
            .wrapper {
                width: 100%;
                background-color: #10232A;
                padding: 40px 0;
            }
            .container {
                max-width: 500px;
                margin: 0 auto;
                background-color: #161616;
                border: 1px solid rgba(255,255,255,0.04);
                border-top: 4px solid #B58863;
                border-radius: 12px;
                padding: 30px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            }
            .logo {
                font-size: 24px;
                font-weight: 800;
                color: #ffffff;
                margin-bottom: 20px;
                letter-spacing: -0.5px;
            }
            .logo span {
                color: #B58863;
                font-weight: 900;
            }
            h1 {
                font-size: 20px;
                color: #ffffff;
                font-weight: 700;
                margin-bottom: 10px;
            }
            p {
                font-size: 14px;
                line-height: 1.6;
                color: #A79E9C;
                margin-bottom: 25px;
            }
            .code-box {
                background-color: rgba(181, 136, 99, 0.1);
                border: 1px dashed rgba(181, 136, 99, 0.3);
                border-radius: 8px;
                padding: 15px 30px;
                font-size: 32px;
                font-weight: 800;
                letter-spacing: 6px;
                color: #B58863;
                display: inline-block;
                margin: 10px 0 25px 0;
                font-family: 'Courier New', Courier, monospace;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid rgba(255,255,255,0.04);
                font-size: 11px;
                color: #55585A;
            }
            .warning {
                font-size: 11px;
                color: #8E7A75;
                font-style: italic;
            }
        </style>
    </head>
    <body>
        <div class="wrapper">
            <div class="container">
                <div class="logo">Infra<span>lab</span></div>
                <h1>Confirm your email address</h1>
                <p>Hello ${name},<br>Welcome to Infralab! Please use the verification code below to confirm your account and start designing system architectures.</p>
                <div class="code-box">${code}</div>
                <p class="warning">This verification code is valid for 1 hour. If you did not request this, please ignore this email.</p>
                <div class="footer">
                    <p style="margin: 0;">© 2026 Infralab. Master System Design Interviews.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        await mailTransporter.sendMail({
            from: env.SMTP_FROM,
            to: email,
            subject: `[Infralab] Email Verification Code: ${code}`,
            text: `Hello ${name},\n\nWelcome to Infralab! Please use the following 6-digit code to verify your email address:\n\n${code}\n\nThis code will expire in 1 hour.\n\nBest regards,\nInfralab Team`,
            html: htmlTemplate,
        });

        logger.info(`✨ Verification email sent successfully to ${email}`);
        return true;
    } catch (error) {
        logger.error(`❌ Failed to send verification email to ${email}:`, error);
        return false;
    }
};

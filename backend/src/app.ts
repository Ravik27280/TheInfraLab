import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import { generalLimiter } from './middlewares/rateLimiter.middleware';
import { errorHandler } from './middlewares/errorHandler.middleware';

// Import routes
import authRoutes from './routes/auth.routes';
import problemRoutes from './routes/problem.routes';
import designRoutes from './routes/design.routes';
import evaluationRoutes from './routes/evaluation.routes';
import paymentRoutes from './routes/payment.routes';
import leaderboardRoutes from './routes/leaderboard.routes';
import feedbackRoutes from './routes/feedback.routes';
import helmet from 'helmet';

const app: Application = express();

// Trust proxy for rate limiting (needed behind reverse proxies like Nginx/Cloudflare)
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet());

// Middleware
app.use(cors({
    origin: env.CORS_ORIGIN.includes(',')
        ? env.CORS_ORIGIN.split(',').map(o => o.trim())
        : env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Apply general rate limiting
app.use('/api', generalLimiter);

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Infralab API is running',
        timestamp: new Date().toISOString(),
    });
});

// Root route landing page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Infralab Backend</title>
            <style>
                body {
                    font-family: system-ui, -apple-system, sans-serif;
                    background-color: #10232A;
                    color: #A79E9C;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                }
                .card {
                    background: #161616;
                    border: 1px solid rgba(255,255,255,0.04);
                    border-top: 4px solid #B58863;
                    padding: 30px;
                    border-radius: 12px;
                    text-align: center;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }
                h1 {
                    color: #fff;
                    margin-top: 0;
                }
                span {
                    color: #B58863;
                }
                .status {
                    display: inline-block;
                    padding: 5px 12px;
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid rgba(16, 185, 129, 0.2);
                    color: #10B981;
                    border-radius: 20px;
                    font-size: 0.9em;
                    font-weight: bold;
                    margin-top: 15px;
                }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>Infra<span>lab</span> Backend</h1>
                <p>The system design sandbox backend API is running successfully.</p>
                <div class="status">● Active & Online</div>
            </div>
        </body>
        </html>
    `);
});

// API Documentation (Swagger UI)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Infralab API Docs',
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/evaluate', evaluationRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/feedback', feedbackRoutes);

// 404 handler - catches all unmatched routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
    });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;

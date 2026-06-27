import express from 'express';
import { authenticate as protect } from '../middlewares/auth.middleware';
import { createFeedback, getFeaturedFeedback } from '../controllers/feedback.controller';

const router = express.Router();

/**
 * @swagger
 * /feedback:
 *   post:
 *     summary: Submit new user feedback
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true;
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Feedback submitted successfully
 */
router.post('/', protect, createFeedback);

/**
 * @swagger
 * /feedback/featured:
 *   get:
 *     summary: Get featured user feedbacks
 *     tags: [Feedback]
 *     responses:
 *       200:
 *         description: Successfully retrieved
 */
router.get('/featured', getFeaturedFeedback);

export default router;

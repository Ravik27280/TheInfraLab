import { Request, Response } from 'express';
import designService from '../services/design.service';
import { sendSuccess, sendError } from '../utils/response.util';

export class DesignController {
    async createDesign(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                sendError(res, 'Authentication required', 401);
                return;
            }

            const design = await designService.createDesign(req.user.userId, req.body, req.user.role);
            sendSuccess(res, design, 'Design saved successfully', 201);
        } catch (error: any) {
            sendError(res, error.message, 400);
        }
    }

    async updateDesign(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                sendError(res, 'Authentication required', 401);
                return;
            }

            const id = req.params.id as string;
            const design = await designService.updateDesign(id, req.user.userId, req.body, req.user.role);
            sendSuccess(res, design, 'Design updated successfully', 200);
        } catch (error: any) {
            const statusCode = error.message.includes('not found') ? 404 : 400;
            sendError(res, error.message, statusCode);
        }
    }

    async getUserDesigns(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                sendError(res, 'Authentication required', 401);
                return;
            }

            const designs = await designService.getUserDesigns(req.user.userId);
            sendSuccess(res, designs);
        } catch (error: any) {
            sendError(res, error.message, 500);
        }
    }

    async getDesignById(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                sendError(res, 'Authentication required', 401);
                return;
            }

            const id = req.params.id as string;
            const design = await designService.getDesignById(id, req.user.userId, req.user.role);
            sendSuccess(res, design);
        } catch (error: any) {
            const statusCode = error.message.includes('not found') ? 404 : 500;
            sendError(res, error.message, statusCode);
        }
    }

    async getDesignByProblemId(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                sendError(res, 'Authentication required', 401);
                return;
            }

            const problemId = req.params.problemId as string;
            const design = await designService.getDesignByProblemId(problemId, req.user.userId, req.user.role);

            if (!design) {
                sendError(res, 'No design found for this problem', 404);
                return;
            }

            sendSuccess(res, design);
        } catch (error: any) {
            sendError(res, error.message, 500);
        }
    }

    async deleteDesign(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                sendError(res, 'Authentication required', 401);
                return;
            }

            const id = req.params.id as string;
            await designService.deleteDesign(id, req.user.userId);
            sendSuccess(res, null, 'Design deleted successfully');
        } catch (error: any) {
            const statusCode = error.message.includes('not found') ? 404 : 500;
            sendError(res, error.message, statusCode);
        }
    }
}

export default new DesignController();

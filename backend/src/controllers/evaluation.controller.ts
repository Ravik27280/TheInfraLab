import { Request, Response } from 'express';
import evaluationService from '../services/evaluation.service';
import { sendSuccess, sendError } from '../utils/response.util';

export class EvaluationController {
    async evaluateDesign(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                sendError(res, 'Authentication required', 401);
                return;
            }
            const { problemId, nodes, edges, designId } = req.body;
            const evaluation = await evaluationService.evaluateDesign(problemId, nodes, edges, designId, req.user.role);
            sendSuccess(res, evaluation, 'Design evaluated successfully');
        } catch (error: any) {
            const statusCode = error.message.includes('not found') ? 404 :
                error.message.includes('subscription') ? 403 : 500;
            sendError(res, error.message, statusCode);
        }
    }
}

export default new EvaluationController();

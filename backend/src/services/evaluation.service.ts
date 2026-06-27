import Design from '../models/Design.model';
import Problem from '../models/Problem.model';
import { IEvaluationResult } from '../types';
import { logger } from '../utils/logger.util';

export class EvaluationService {
    constructor() {
        logger.info('ℹ️ Running in Portfolio/Mock Mode');
    }

    /**
     * Evaluate a system design using Mock Evaluation (Public Repo Version)
     */
    async evaluateDesign(
        problemId: string,
        nodes?: any[],
        edges?: any[],
        designId?: string | null,
        userRole?: string
    ): Promise<IEvaluationResult> {
        let finalNodes = nodes;
        let finalEdges = edges;
        let design = null;

        if (designId) {
            design = await Design.findById(designId);
            if (!design) {
                throw new Error('Design not found');
            }
            if (!finalNodes) finalNodes = design.nodes;
            if (!finalEdges) finalEdges = design.edges;
        }

        const problem = await Problem.findById(problemId);
        if (!problem) {
            throw new Error('Problem not found');
        }

        if (problem.isPro && userRole !== 'pro') {
            throw new Error('Pro subscription required to access this problem');
        }

        if (!finalNodes || !finalEdges) {
            throw new Error('Design components (nodes and edges) are required for evaluation');
        }

        // Run mock evaluation directly
        const evaluation: IEvaluationResult = this.getMockEvaluation();
        logger.info(`✅ Mock evaluation completed successfully`);

        if (design) {
            design.evaluationResult = evaluation;
            if (nodes) design.nodes = nodes;
            if (edges) design.edges = edges;
            await design.save();
            logger.info(`💾 Evaluation result saved to design ${designId}`);
        }

        return evaluation;
    }

    /**
     * Fallback mock evaluation
     */
    private getMockEvaluation(): IEvaluationResult {
        return {
            score: 75,
            summary: "A solid baseline design that covers most core requirements but lacks advanced scalability features.",
            requirementAnalysis: [
                { requirement: "Handle URL redirection", met: true, comment: "API service handles this." },
                { requirement: "High Availability", met: false, comment: "Single database instance is a SPOF." }
            ],
            strengths: [
                'Good use of load balancer',
                'Separation of concerns is clear',
            ],
            warnings: [
                'Database might become a bottleneck',
                'No caching layer visible'
            ],
            errors: [
                'No database replication defined',
            ],
            suggestions: [
                'Add Redis for caching',
                'Implement database sharding',
            ],
            securityAnalysis: "Basic architecture lacks detailed security components like WAF or private subnets.",
            scalabilityAnalysis: "Horizontal scaling is possible for APIs, but database needs read replicas."
        };
    }
}

export default new EvaluationService();


import Design from '../models/Design.model';
import Problem from '../models/Problem.model';
import { DesignInput } from '../validators/design.validator';

export class DesignService {
    async createDesign(userId: string, data: DesignInput, userRole?: string) {
        // Enforce Pro problem check
        const problem = await Problem.findById(data.problemId);
        if (!problem) {
            throw new Error('Problem not found');
        }
        if (problem.isPro && userRole !== 'pro') {
            throw new Error('Pro subscription required to access this problem');
        }

        const design = await Design.create({
            userId,
            problemId: data.problemId,
            name: data.name,
            nodes: data.nodes,
            edges: data.edges,
        });

        return design;
    }

    async updateDesign(designId: string, userId: string, data: Partial<DesignInput>, userRole?: string) {
        const design = await Design.findOne({ _id: designId, userId }).populate('problemId');
        if (!design) {
            throw new Error('Design not found or access denied');
        }

        const problem = design.problemId as any;
        if (problem && problem.isPro && userRole !== 'pro') {
            throw new Error('Pro subscription required to access this problem');
        }

        // Apply updates
        if (data.name !== undefined) design.name = data.name;
        if (data.nodes !== undefined) design.nodes = data.nodes;
        if (data.edges !== undefined) design.edges = data.edges;

        await design.save();
        return design;
    }

    async getUserDesigns(userId: string) {
        const designs = await Design.find({ userId })
            .populate('problemId', 'title difficulty isPro')
            .select('-__v')
            .sort({ updatedAt: -1 });

        return designs;
    }

    async getDesignById(designId: string, userId: string, userRole?: string) {
        const design = await Design.findOne({ _id: designId, userId })
            .populate('problemId', 'title difficulty description isPro')
            .select('-__v');

        if (!design) {
            throw new Error('Design not found or access denied');
        }

        const problem = design.problemId as any;
        if (problem && problem.isPro && userRole !== 'pro') {
            throw new Error('Pro subscription required to access this problem');
        }

        return design;
    }

    async getDesignByProblemId(problemId: string, userId: string, userRole?: string) {
        const problem = await Problem.findById(problemId);
        if (!problem) {
            throw new Error('Problem not found');
        }
        if (problem.isPro && userRole !== 'pro') {
            throw new Error('Pro subscription required to access this problem');
        }

        const design = await Design.findOne({ problemId, userId })
            .populate('problemId', 'title difficulty description isPro')
            .select('-__v')
            .sort({ updatedAt: -1 }); // Get the latest design if multiple exist

        return design; // Returns null if not found
    }

    async deleteDesign(designId: string, userId: string) {
        const result = await Design.deleteOne({ _id: designId, userId });
        if (result.deletedCount === 0) {
            throw new Error('Design not found or access denied');
        }
        return true;
    }
}

export default new DesignService();

import Problem from '../models/Problem.model';

export class ProblemService {
    async getAllProblems(userRole: 'free' | 'pro') {
        // Return all problems to all users so free users can see locked challenges in the catalog
        const problems = await Problem.find({})
            .select('-__v')
            .sort({ createdAt: -1 });

        return problems;
    }

    async getProblemById(problemId: string, userRole: 'free' | 'pro') {
        const problem = await Problem.findById(problemId).select('-__v');

        if (!problem) {
            throw new Error('Problem not found');
        }

        // Check if user has access to pro problem - enforced for production security
        if (problem.isPro && userRole !== 'pro') {
            throw new Error('Pro subscription required to access this problem');
        }

        return problem;
    }
}

export default new ProblemService();

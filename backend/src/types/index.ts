export interface IUser {
    id?: string;
    name: string;
    email: string;
    password: string;
    role: 'free' | 'pro';
    subscriptionStatus: 'active' | 'inactive' | 'cancelled';
    avatar?: string;
    isEmailVerified?: boolean;
    emailVerificationCode?: string;
    emailVerificationExpires?: Date;
    createdAt: Date;
}

export interface IProblem {
    id?: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    description: string;
    functionalRequirements: string[];
    nonFunctionalRequirements: string[];
    scale: {
        users?: string;
        requests?: string;
        data?: string;
    };
    isPro: boolean;
    companies: string[];
    concepts: string[];
    createdAt: Date;
}

export interface IDesign {
    id?: string;
    userId: string;
    problemId: string;
    name?: string;
    nodes: any[];
    edges: any[];
    evaluationResult?: IEvaluationResult;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IEvaluationResult {
    score: number;
    summary: string;
    requirementAnalysis: {
        requirement: string;
        met: boolean;
        comment: string;
    }[];
    strengths: string[];
    warnings: string[];
    errors: string[];
    suggestions: string[];
    securityAnalysis?: string;
    scalabilityAnalysis?: string;
}

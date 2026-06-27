// Global type definitions for Infralab

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'free' | 'pro';
    avatar?: string;
    createdAt?: string;
}

export interface Problem {
    id: string;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    functionalRequirements: string[];
    nonFunctionalRequirements: string[];
    scale?: {
        users?: string;
        requests?: string;
        data?: string;
    };
    isPro: boolean;
    companies?: string[];
    concepts?: string[];
    createdAt?: string;
    requirements?: string[];
    estimatedTime?: string;
    category?: string;
    tags?: string[];
    solvedCount?: number;
}

export interface Design {
    id: string;
    problemId: string;
    userId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    nodes: FlowNode[];
    edges: FlowEdge[];
    feedback?: FeedbackResult;
}

export interface FlowNode {
    id: string;
    type?: string; // Optional to match React Flow's Node type
    position: { x: number; y: number };
    data: NodeData;
}

export interface NodeData {
    label?: string; // Optional for React Flow compatibility
    nodeType?: string;
    config?: NodeConfig;
    [key: string]: unknown; // Index signature for React Flow compatibility
}

export interface NodeConfig {
    replicationFactor?: number;
    storage?: string;
    caching?: boolean;
    [key: string]: string | number | boolean | undefined;
}

export interface FlowEdge {
    id: string;
    source: string;
    target: string;
    type?: string;
}

export interface FeedbackResult {
    score: number;
    summary?: string;
    requirementAnalysis?: {
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

export type Theme = 'light' | 'dark';

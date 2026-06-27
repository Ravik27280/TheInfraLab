import { create, useStore } from 'zustand';
import { persist } from 'zustand/middleware';
import { temporal } from 'zundo';
import type { User, Problem, Design, Theme, FlowNode, FlowEdge, FeedbackResult } from '../types';
import * as authApi from '../api/auth.api';

interface AppState {
    // Theme
    theme: Theme;
    toggleTheme: () => void;

    // Authentication
    token: string | null;
    setToken: (token: string | null) => void;
    clearToken: () => void;
    logout: () => Promise<void>;

    // User
    user: User | null;
    setUser: (user: User | null) => void;

    // Problems
    problems: Problem[];
    setProblems: (problems: Problem[]) => void;

    // Search
    searchQuery: string;
    setSearchQuery: (query: string) => void;

    // Designs
    designs: Design[];
    setDesigns: (designs: Design[]) => void;
    addDesign: (design: Design) => void;
    updateDesign: (id: string, design: Partial<Design>) => void;
    deleteDesign: (id: string) => void;

    // Current workspace
    currentProblem: Problem | null;
    setCurrentProblem: (problem: Problem | null) => void;
    currentDesignId: string | null;
    currentDesignName: string | null;
    setCurrentDesign: (id: string | null, name: string | null) => void;
    lastSavedHash: string | null;
    setLastSavedHash: (hash: string | null) => void;

    // Architecture canvas
    nodes: FlowNode[];
    edges: FlowEdge[];
    setNodes: (nodes: FlowNode[]) => void;
    setEdges: (edges: FlowEdge[]) => void;
    updateNodeData: (id: string, data: any) => void;

    // Selected node for configuration panel
    selectedNode: FlowNode | null;
    setSelectedNode: (node: FlowNode | null) => void;

    // Evaluation Feedback
    feedback: FeedbackResult | null;
    setFeedback: (feedback: FeedbackResult | null) => void;
}

export const useAppStore = create<AppState>()(
    temporal(
        persist(
            (set) => ({
            // Theme
            theme: 'dark',
            toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

            // Authentication
            token: null,
            setToken: (token) => set({ token }),
            clearToken: () => {
                localStorage.removeItem('token');
                set({ token: null });
            },
            logout: async () => {
                try {
                    await authApi.logout();
                } catch (error) {
                    console.error('Logout error:', error);
                }
                localStorage.removeItem('token');
                set({
                    token: null,
                    user: null,
                    designs: [],
                    problems: [],
                    feedback: null,
                    nodes: [],
                    edges: [],
                    currentProblem: null,
                    currentDesignId: null,
                    currentDesignName: null,
                    selectedNode: null,
                    searchQuery: ''
                });
            },

            // User
            user: null,
            setUser: (user) => set({ user }),

            // Problems
            problems: [],
            setProblems: (problems) => set({ problems }),

            // Search
            searchQuery: '',
            setSearchQuery: (searchQuery) => set({ searchQuery }),

            // Designs
            designs: [],
            setDesigns: (designs) => set({ designs }),
            addDesign: (design) => set((state) => ({ designs: [...state.designs, design] })),
            updateDesign: (id, updatedDesign) =>
                set((state) => ({
                    designs: state.designs.map((d) => (d.id === id ? { ...d, ...updatedDesign } : d)),
                })),
            deleteDesign: (id) => set((state) => ({ designs: state.designs.filter((d) => d.id !== id) })),

            // Current workspace
            currentProblem: null,
            setCurrentProblem: (problem) => set({ currentProblem: problem }),
            currentDesignId: null,
            currentDesignName: null,
            setCurrentDesign: (id, name) => set({ currentDesignId: id, currentDesignName: name }),
            lastSavedHash: null,
            setLastSavedHash: (lastSavedHash) => set({ lastSavedHash }),

            // Architecture canvas
            nodes: [],
            edges: [],
            setNodes: (nodes) => set({ nodes }),
            setEdges: (edges) => set({ edges }),
            updateNodeData: (id, data) =>
                set((state) => {
                    const updatedNodes = state.nodes.map((node) => {
                        if (node.id === id) {
                            return { ...node, data: { ...node.data, ...data } };
                        }
                        return node;
                    });

                    // Also update selectedNode if it's the one being modified
                    const updatedSelectedNode = state.selectedNode?.id === id
                        ? { ...state.selectedNode, data: { ...state.selectedNode.data, ...data } }
                        : state.selectedNode;

                    return { nodes: updatedNodes, selectedNode: updatedSelectedNode };
                }),

            // Selected node
            selectedNode: null,
            setSelectedNode: (node) => set({ selectedNode: node }),

            // Evaluation Feedback
            feedback: null,
            setFeedback: (feedback) => set({ feedback }),
        }),
        {
            name: 'infralab-storage',
            partialize: (state) => ({
                theme: state.theme,
                user: state.user,
                designs: state.designs,
                currentProblem: state.currentProblem,
                currentDesignId: state.currentDesignId,
                currentDesignName: state.currentDesignName,
                problems: state.problems,
                feedback: state.feedback,
                nodes: state.nodes,
                edges: state.edges,
                lastSavedHash: state.lastSavedHash,
            }),
        }
    ),
    {
        partialize: (state) => ({
            nodes: state.nodes,
            edges: state.edges,
        }),
    }
    )
);

export const useTemporalStore = <T>(
    selector: (state: any) => T,
) => useStore(useAppStore.temporal, selector);

export const getCanvasHash = (nodes: any[], edges: any[]): string => {
    return JSON.stringify({
        nodes: (nodes || []).map(n => ({ 
            id: n.id, 
            type: n.type, 
            position: { x: Math.round(n.position?.x || 0), y: Math.round(n.position?.y || 0) }, 
            data: n.data 
        })),
        edges: (edges || []).map(e => ({ 
            id: e.id, 
            source: e.source, 
            target: e.target, 
            label: e.label 
        }))
    });
};

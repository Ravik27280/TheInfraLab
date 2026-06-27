import React, { useEffect, useState } from 'react';
import { Settings, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../store';
import { ConfigurationPanel } from './ConfigurationPanel';
import { FeedbackPanel } from './FeedbackPanel';
import { cn } from '../../utils/cn';

export const WorkspaceRightPanel: React.FC = () => {
    const { feedback, selectedNode } = useAppStore();
    const [activeTab, setActiveTab] = useState<'config' | 'review'>('config');

    // Auto-switch to review tab when feedback is received
    useEffect(() => {
        if (feedback) {
            setActiveTab('review');
        }
    }, [feedback]);

    // Auto-switch to config tab when a node is selected (and no recent feedback or user explicit action)
    // For now, let's keep it simple: if user clicks a node, we probably want to see config.
    // But if they just ran an eval, they want to see feedback.
    useEffect(() => {
        if (selectedNode) {
            // Only switch if we're not already viewing feedback that just arrived
            // A simple heuristic: if feedback is null, definitely switch.
            // If feedback exists, maybe the user is looking at it. 
            // Let's stick to manual switching for now if feedback is present to avoid annoyance,
            // or maybe only switch if the user explicitly clicks the node? 
            // React Flow's onNodeClick would trigger selectedNode change.
            // Let's switch to config if they select a node, as that's an explicit action.
            setActiveTab('config');
        }
    }, [selectedNode]);

    return (
        <div className="h-full flex flex-col bg-[rgb(var(--color-surface))] border-l border-[rgb(var(--color-border))]">
            {/* Tabs Header */}
            <div className="flex items-center border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-secondary))]">
                <button
                    onClick={() => setActiveTab('config')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors relative",
                        activeTab === 'config'
                            ? "text-[rgb(var(--color-text-primary))] bg-[rgb(var(--color-surface))]"
                            : "text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-tertiary))]"
                    )}
                >
                    <Settings className="w-4 h-4" />
                    <span>Config</span>
                    {activeTab === 'config' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[rgb(var(--color-primary))]" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('review')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors relative",
                        activeTab === 'review'
                            ? "text-[rgb(var(--color-text-primary))] bg-[rgb(var(--color-surface))]"
                            : "text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-tertiary))]"
                    )}
                >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Review</span>
                    {feedback && (
                        <span className="w-2 h-2 rounded-full bg-[rgb(var(--color-primary))] absolute top-3 right-4 animate-pulse" />
                    )}
                    {activeTab === 'review' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[rgb(var(--color-primary))]" />
                    )}
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
                <div className={cn(
                    "absolute inset-0 transition-opacity duration-300",
                    activeTab === 'config' ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                )}>
                    <ConfigurationPanel />
                </div>
                <div className={cn(
                    "absolute inset-0 transition-opacity duration-300",
                    activeTab === 'review' ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                )}>
                    <FeedbackPanel />
                </div>
            </div>
        </div>
    );
};

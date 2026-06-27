import React from 'react';
import { Panel } from '../../components/Panel';
import type { Problem } from '../../types';

interface RequirementsPanelProps {
    problem: Problem;
}

export const RequirementsPanel: React.FC<RequirementsPanelProps> = ({ problem }) => {
    return (
        <div className="h-full bg-[rgb(var(--color-surface))] overflow-auto">
            <Panel title="Requirements">
                <div className="space-y-6">
                    {/* Problem Title & Description */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-[rgb(var(--color-text-primary))]">
                                {problem.title}
                            </h3>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                                (problem.difficulty || '').toLowerCase() === 'easy'
                                    ? 'bg-green-500/20 text-green-500'
                                    : (problem.difficulty || '').toLowerCase() === 'medium'
                                        ? 'bg-yellow-500/20 text-yellow-500'
                                        : 'bg-red-500/20 text-red-500'
                                }`}>
                                {problem.difficulty}
                            </span>
                        </div>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                            {problem.description}
                        </p>
                    </div>

                    {/* Functional Requirements */}
                    <div>
                        <h4 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-2">
                            Functional Requirements:
                        </h4>
                        <ul className="space-y-2">
                            {problem.functionalRequirements.map((req, idx) => (
                                <li
                                    key={idx}
                                    className="text-sm text-[rgb(var(--color-text-secondary))] flex items-start gap-2"
                                >
                                    <span className="text-[rgb(var(--color-primary))]">•</span>
                                    {req}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Non-Functional Requirements */}
                    <div>
                        <h4 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-2">
                            Non-Functional Requirements:
                        </h4>
                        <ul className="space-y-2">
                            {problem.nonFunctionalRequirements.map((req, idx) => (
                                <li
                                    key={idx}
                                    className="text-sm text-[rgb(var(--color-text-secondary))] flex items-start gap-2"
                                >
                                    <span className="text-[rgb(var(--color-success))]">•</span>
                                    {req}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Scale Information */}
                    {problem.scale && (
                        <div>
                            <h4 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-2">
                                Scale:
                            </h4>
                            <div className="space-y-1 text-sm text-[rgb(var(--color-text-secondary))]">
                                {problem.scale.users && (
                                    <div className="flex justify-between">
                                        <span>Users:</span>
                                        <span className="font-medium">{problem.scale.users}</span>
                                    </div>
                                )}
                                {problem.scale.requests && (
                                    <div className="flex justify-between">
                                        <span>Requests:</span>
                                        <span className="font-medium">{problem.scale.requests}</span>
                                    </div>
                                )}
                                {problem.scale.data && (
                                    <div className="flex justify-between">
                                        <span>Data:</span>
                                        <span className="font-medium">{problem.scale.data}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </Panel>
        </div>
    );
};

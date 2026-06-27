import React, { useEffect, useState } from 'react';
import { Panel } from '../../components/Panel';
import { useAppStore } from '../../store';
import { Button } from '../../components/Button';
import { nodeConfigs } from './nodeConfigs';

export const ConfigurationPanel: React.FC = () => {
    const { selectedNode, updateNodeData } = useAppStore();
    const [formData, setFormData] = useState<Record<string, any>>({});

    // Reset form when selected node changes
    useEffect(() => {
        if (selectedNode) {
            const currentData = selectedNode.data.config || {};
            const initialData: Record<string, any> = {};

            // Get config definition for this node type
            const configDef = nodeConfigs[selectedNode.data.nodeType as string] || [];

            // Populate with existing data or defaults
            configDef.forEach(opt => {
                if (currentData[opt.id] !== undefined) {
                    // Use existing value
                    initialData[opt.id] = currentData[opt.id];
                } else if (opt.defaultValue !== undefined) {
                    // Use default value
                    initialData[opt.id] = opt.defaultValue;
                }
            });

            // Also include label if not in configDef but we want to edit it
            initialData.label = selectedNode.data.label || '';

            setFormData(initialData);
        }
    }, [selectedNode?.id, selectedNode?.data.nodeType]);

    const handleChange = (id: string, value: any) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSave = () => {
        if (selectedNode) {
            // Separate label from config
            const { label, ...config } = formData;

            updateNodeData(selectedNode.id, {
                label,
                config
            });
        }
    };

    if (!selectedNode) {
        return (
            <div className="h-full bg-[rgb(var(--color-surface))]">
                <Panel title="Node Configuration">
                    <div className="flex flex-col items-center justify-center h-48 text-[rgb(var(--color-text-tertiary))] text-center p-4">
                        <p className="mb-2">⚠️</p>
                        <p className="text-sm">Select a component on the canvas to configure its properties.</p>
                    </div>
                </Panel>
            </div>
        );
    }

    const nodeType = selectedNode.data.nodeType as string;
    const configOptions = nodeConfigs[nodeType] || [];

    return (
        <div className="h-full bg-[rgb(var(--color-surface))] flex flex-col">
            <Panel title="Node Configuration">
                <div className="space-y-6 pb-20">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-[rgb(var(--color-text-secondary))] mb-1.5 uppercase tracking-wider">
                                Component Type
                            </label>
                            <div className="w-full px-3 py-2 text-sm rounded-lg bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-secondary))] capitalize">
                                {selectedNode.data.label as string || nodeType}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1.5">
                                Label
                            </label>
                            <input
                                type="text"
                                value={formData.label || ''}
                                onChange={(e) => handleChange('label', e.target.value)}
                                className="w-full px-3 py-2 text-sm rounded-lg bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] transition-all"
                                placeholder="Enter component label"
                            />
                        </div>
                    </div>

                    <div className="w-full h-[1px] bg-[rgb(var(--color-border))]" />

                    {/* Dynamic Details */}
                    {configOptions.length > 0 ? (
                        <div className="space-y-4">
                            <h4 className="text-xs font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider">
                                Properties
                            </h4>
                            {configOptions.map((option) => (
                                <div key={option.id}>
                                    <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1.5">
                                        {option.label}
                                    </label>

                                    {option.type === 'select' ? (
                                        <div className="relative">
                                            <select
                                                value={formData[option.id]}
                                                onChange={(e) => handleChange(option.id, e.target.value)}
                                                className="w-full px-3 py-2 text-sm rounded-lg bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] appearance-none transition-all cursor-pointer"
                                            >
                                                {option.options?.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[rgb(var(--color-text-tertiary))]">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                            </div>
                                        </div>
                                    ) : option.type === 'boolean' ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={formData[option.id] || false}
                                                onChange={(e) => handleChange(option.id, e.target.checked)}
                                                className="w-4 h-4 rounded border-[rgb(var(--color-border))] text-[rgb(var(--color-primary))] focus:ring-[rgb(var(--color-primary))]"
                                            />
                                            <span className="text-sm text-[rgb(var(--color-text-secondary))]">Enabled</span>
                                        </div>
                                    ) : (
                                        <input
                                            type={option.type}
                                            value={formData[option.id] || ''}
                                            onChange={(e) => handleChange(option.id, option.type === 'number' ? Number(e.target.value) : e.target.value)}
                                            className="w-full px-3 py-2 text-sm rounded-lg bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] transition-all"
                                            placeholder={option.placeholder}
                                        />
                                    )}
                                    {option.description && (
                                        <p className="mt-1 text-xs text-[rgb(var(--color-text-tertiary))]">{option.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-4 bg-[rgb(var(--color-bg-secondary))] rounded-lg">
                            <p className="text-xs text-[rgb(var(--color-text-tertiary))]">
                                No specific properties to configure for this component type.
                            </p>
                        </div>
                    )}

                    {/* Apply Button */}
                    <div className="pt-4">
                        <Button onClick={handleSave} className="w-full">
                            Apply Changes
                        </Button>
                    </div>
                </div>
            </Panel>
        </div>
    );
};

import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    type Connection,
    type Node,
    type NodeChange,
    type EdgeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '../../components/Button';
import { useAppStore, useTemporalStore, getCanvasHash } from '../../store';
import * as evaluationApi from '../../api/evaluation.api';
import { CustomNode } from './CustomNode';
import { AnimatedEdge } from './AnimatedEdge.tsx';
import { ComponentPalette } from './ComponentPalette';
import { Play, Square, RotateCcw, RotateCw, Trash2 } from 'lucide-react';

const nodeTypes = {
    custom: CustomNode,
    customNode: CustomNode,
};

const edgeTypes = {
    animated: AnimatedEdge,
};

// Initial node templates (not used in this version)
// const initialNodes: Node[] = [];

export const ArchitectureCanvas: React.FC = () => {
    const {
        nodes,
        edges,
        setNodes,
        setEdges,
        setSelectedNode,
        currentProblem,
        currentDesignId
    } = useAppStore();

    // We don't use useNodesState/useEdgesState anymore because we want 
    // single source of truth from the store to handle updates from ConfigurationPanel

    const [evaluating, setEvaluating] = useState(false);

    // Zundo Temporal Store for Undo/Redo
    const { undo, redo, pastStates, futureStates } = useTemporalStore((state) => state);

    // Animation state
    const [isAnimating, setIsAnimating] = useState(false);
    const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set());
    const [activeEdges, setActiveEdges] = useState<Set<string>>(new Set());
    const abortControllerRef = useRef<AbortController | null>(null);

    // Handle nodes change
    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {
            setNodes(applyNodeChanges(changes, nodes));
        },
        [nodes, setNodes]
    );

    // Handle edges change
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => {
            setEdges(applyEdgeChanges(changes, edges));
        },
        [edges, setEdges]
    );

    // History is now managed by zundo middleware.

    const onConnect = useCallback(
        (params: Connection) => {
            setEdges(addEdge(params, edges));
        },
        [edges, setEdges]
    );

    const onNodeClick = useCallback(
        (_: React.MouseEvent, node: Node) => {
            setSelectedNode(node as any);
        },
        [setSelectedNode]
    );

    const addNode = (type: string, label: string) => {
        const newNode: Node = {
            id: `${type}-${Date.now()}`,
            type: 'custom',
            position: {
                x: Math.random() * 300 + 100,
                y: Math.random() * 200 + 100,
            },
            data: { label, nodeType: type },
        };
        setNodes([...nodes, newNode]);
    };

    const handleClearAll = () => {
        if (window.confirm('Are you sure you want to clear all nodes and connections?')) {
            setNodes([]);
            setEdges([]);
        }
    };

    // Sleep utility for animation timing with abort check
    const sleep = (ms: number, signal?: AbortSignal) => new Promise((resolve, reject) => {
        if (signal?.aborted) return reject(new DOMException('Aborted', 'AbortError'));

        const timeout = setTimeout(() => resolve(true), ms);

        if (signal) {
            signal.addEventListener('abort', () => {
                clearTimeout(timeout);
                reject(new DOMException('Aborted', 'AbortError'));
            });
        }
    });

    const stopAnimation = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsAnimating(false);
        setActiveNodes(new Set());
        setActiveEdges(new Set());
    };

    // Animate request flow through the architecture
    const animateRequestFlow = async () => {
        // Reset previous animation
        stopAnimation();

        // New abort controller
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        setIsAnimating(true);
        setActiveNodes(new Set());
        setActiveEdges(new Set());

        try {
            // Find entry points (client nodes, or any node without incoming edges)
            const entryNodes = nodes.filter(node => {
                const hasIncoming = edges.some(edge => edge.target === node.id);
                return !hasIncoming || node.data.nodeType === 'client';
            });

            if (entryNodes.length === 0 && nodes.length > 0) {
                // If no clear entry point, use first node
                entryNodes.push(nodes[0]);
            }



            // Simulate multiple parallel requests (3 requests)
            const requestCount = 3;
            const promises = [];

            for (let req = 0; req < requestCount; req++) {
                // Slight delay between request starts
                if (req > 0) await sleep(600, signal);

                // Start request animation
                promises.push(traverseFromNode(entryNodes, req, signal));
            }

            // Wait for all animations to complete
            await Promise.all(promises);

            // Wait a bit before clearing
            await sleep(2000, signal);

        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Animation stopped by user');
            } else {
                console.error('Animation error:', error);
            }
        } finally {
            if (!signal.aborted) {
                setIsAnimating(false);
                setActiveNodes(new Set());
                setActiveEdges(new Set());
                abortControllerRef.current = null;
            }
        }
    };

    // Traverse from entry nodes through the architecture
    const traverseFromNode = async (startNodes: Node[], requestId: number, signal: AbortSignal) => {
        const visited = new Set<string>();
        const queue: string[] = startNodes.map(n => n.id);

        while (queue.length > 0) {
            if (signal.aborted) throw new DOMException('Aborted', 'AbortError');

            const nodeId = queue.shift()!;

            if (visited.has(nodeId)) continue;
            visited.add(nodeId);

            // Activate node
            setActiveNodes(prev => new Set([...prev, nodeId]));
            await sleep(800, signal);

            // Find outgoing edges
            const outEdges = edges.filter(e => e.source === nodeId);

            // If this is a load balancer, distribute to ONE target (simulate round-robin)
            const currentNode = nodes.find(n => n.id === nodeId);
            if (currentNode?.data.nodeType === 'loadBalancer' && outEdges.length > 1) {
                // Select one edge based on requestId (round-robin simulation)
                const selectedEdge = outEdges[requestId % outEdges.length];

                // Activate selected edge
                setActiveEdges(prev => new Set([...prev, selectedEdge.id]));
                await sleep(600, signal);

                queue.push(selectedEdge.target);
            } else {
                // Normal case: activate all outgoing edges
                for (const edge of outEdges) {
                    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
                    setActiveEdges(prev => new Set([...prev, edge.id]));
                    await sleep(400, signal);
                    queue.push(edge.target);
                }
            }

            // Deactivate node after processing (simulating "passing through")
            // await sleep(600, signal);
            setActiveNodes(prev => {
                const newSet = new Set(prev);
                // Keep active? Or flicker? Let's keep it active for a bit then off
                // newSet.delete(nodeId);
                return newSet;
            });

            // Create a separate "cleanup" task for this node to turn off after delay
            setTimeout(() => {
                if (!signal.aborted) {
                    setActiveNodes(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(nodeId);
                        return newSet;
                    });
                }
            }, 600);
        }
    };

    // Handle dropping nodes from palette
    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow/type');
            const label = event.dataTransfer.getData('application/reactflow/label');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            // Project the position to canvas coordinates
            // Simple approximation for now as we don't have the react flow instance ref readily available 
            // without wrapping in ReactFlowProvider. 
            // For now, random position around the center or cursor if possible.
            // Ideally we use functionality from `useReactFlow` hook but we are inside the component.
            // Let's just add it at a default position + some random offset
            addNode(type, label);
        },
        [nodes, setNodes] // Updated dependency
    );

    const handleEvaluate = useCallback(async () => {
        if (!currentProblem) {
            alert('Please select a problem first');
            return;
        }

        if (nodes.length === 0) {
            alert('Please add at least one component to your design');
            return;
        }

        setEvaluating(true);

        try {
            // Start flow animation
            animateRequestFlow(); // Don't await, let it run

            const currentHash = getCanvasHash(nodes, edges);
            const { lastSavedHash, setLastSavedHash } = useAppStore.getState();

            // If we have an existing designId, auto-save modifications only when they have changed since last save
            if (currentDesignId) {
                if (currentHash !== lastSavedHash) {
                    const designsApi = await import('../../api/designs.api');
                    await designsApi.updateDesign(currentDesignId, {
                        nodes: nodes as any,
                        edges: edges as any,
                    });
                    setLastSavedHash(currentHash);
                    console.log('💾 Auto-saved modifications to DB during evaluation.');
                } else {
                    console.log('ℹ️ Design layout is unchanged. Skipping database auto-save.');
                }
            }

            // Call evaluation API transiently if currentDesignId is null
            const result = await evaluationApi.evaluateDesign({
                problemId: currentProblem.id,
                nodes: nodes as any,
                edges: edges as any,
                designId: currentDesignId,
            });

            // Update store with feedback
            useAppStore.getState().setFeedback(result);

            // alert('Design evaluated successfully! Check the Feedback panel for results.');
        } catch (error: any) {
            console.error('Evaluation failed:', error);
            alert(`Evaluation failed: ${error.message}`);
            stopAnimation();
        } finally {
            setEvaluating(false);
        }
    }, [currentProblem, nodes, edges, currentDesignId]);

    useEffect(() => {
        const handleTriggerEvaluation = () => {
            handleEvaluate();
        };

        document.addEventListener('trigger-evaluation', handleTriggerEvaluation);
        return () => {
            document.removeEventListener('trigger-evaluation', handleTriggerEvaluation);
        };
    }, [handleEvaluate]);

    return (
        <div className="h-full w-full relative bg-[rgb(var(--color-bg))] flex" onDragOver={onDragOver} onDrop={onDrop}>
            {/* Left Toolbar / Palette */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-4 pointer-events-none max-h-[calc(100%-2rem)]">
                {/* Control buttons */}
                <div className="bg-[rgb(var(--color-card))] rounded-app shadow-app-lg p-1.5 flex gap-1 pointer-events-auto border border-[rgb(var(--color-border))]">
                    <Button size="icon" variant="ghost" onClick={undo} disabled={pastStates.length === 0} title="Undo">
                        <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={redo} disabled={futureStates.length === 0} title="Redo">
                        <RotateCw className="w-4 h-4" />
                    </Button>
                    <div className="w-[1px] bg-[rgb(var(--color-border))] mx-1" />
                    <Button size="icon" variant="ghost" onClick={handleClearAll} title="Clear All" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>

                {/* Component Palette using the new component */}
                <ComponentPalette onAddNode={addNode} />
            </div>

            {/* Evaluate Button & Stop Controls */}
            <div className="absolute bottom-4 right-4 z-10 flex gap-2">
                {isAnimating && (
                    <Button onClick={stopAnimation} variant="danger" className="shadow-lg animate-in fade-in slide-in-from-bottom-2">
                        <Square className="w-4 h-4 mr-2 fill-current" />
                        Stop Animation
                    </Button>
                )}

                <Button onClick={handleEvaluate} disabled={evaluating} className="shadow-lg">
                    {evaluating ? (
                        <>Processing...</>
                    ) : (
                        <>
                            <Play className="w-4 h-4 mr-2 fill-current" />
                            Evaluate Design
                        </>
                    )}
                </Button>
            </div>

            {/* React Flow Canvas */}
            <ReactFlow
                nodes={nodes.map(node => ({
                    ...node,
                    data: { ...node.data, isActive: activeNodes.has(node.id) }
                }))}
                edges={edges.map(edge => ({
                    ...edge,
                    type: 'animated',
                    data: { isActive: activeEdges.has(edge.id) }
                }))}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                deleteKeyCode="Delete"
                fitView
                className="bg-[rgb(var(--color-bg-tertiary))]"
            >
                <Background color="rgb(var(--color-border))" gap={16} />
                <Controls showInteractive={false} className="bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-app-sm rounded-lg overflow-hidden" />
                <MiniMap position="top-right" className="bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-app-sm rounded-lg overflow-hidden" zoomable pannable />
            </ReactFlow>
        </div>
    );
};

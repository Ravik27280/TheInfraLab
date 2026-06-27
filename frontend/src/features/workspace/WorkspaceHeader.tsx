import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Download, Loader2, Save, Copy, Home, ChevronLeft, ChevronDown, Check, User, Settings, Timer, BookOpen, Upload, FileText } from 'lucide-react';
import { useAppStore, getCanvasHash } from '../../store';
import { Button } from '../../components/Button';
import * as designsApi from '../../api/designs.api';
import type { Design } from '../../types';
import { toPng } from 'html-to-image';
import { getExampleSolution } from './exampleSolutions';

export const WorkspaceHeader: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { currentProblem, currentDesignId, currentDesignName, setCurrentDesign, nodes, edges, setNodes, setEdges } = useAppStore();

    const mode = searchParams.get('mode');
    const durationParam = searchParams.get('duration');

    // Timer State
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const hasTriggeredEvaluation = useRef(false);

    // Saving State
    const [isSaving, setIsSaving] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
    const [problemDesigns, setProblemDesigns] = useState<Design[]>([]);

    // Save As Modal State
    const [saveAsModalOpen, setSaveAsModalOpen] = useState(false);
    const [saveAsName, setSaveAsName] = useState("My Design Attempt");
    const [overwritingDesignId, setOverwritingDesignId] = useState<string | null>(null);

    // Export State
    const [isExporting, setIsExporting] = useState(false);
    
    // Hidden file input for JSON import
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadProblemDesigns = useCallback(() => {
        if (currentProblem) {
            designsApi.getUserDesigns().then(designs => {
                const filtered = designs.filter(d => {
                    const idStr = typeof d.problemId === 'object' ? (d.problemId as any)._id || (d.problemId as any).id : d.problemId;
                    return idStr === currentProblem.id;
                });
                setProblemDesigns(filtered);
            }).catch(err => console.error("Failed to load problem designs", err));
        }
    }, [currentProblem]);

    useEffect(() => {
        loadProblemDesigns();
    }, [loadProblemDesigns, currentDesignId]); // Refresh when design changes

    const handleLoadExample = () => {
        if (!currentProblem) return;
        const solution = getExampleSolution(currentProblem.title);
        if (solution) {
            if (window.confirm("Are you sure you want to load the example solution? This will overwrite your current canvas progress.")) {
                setNodes(solution.nodes);
                setEdges(solution.edges);
                useAppStore.getState().setFeedback(solution.feedback);
            }
        } else {
            alert("No example solution configured for this challenge.");
        }
    };

    const handleSave = async () => {
        if (!currentProblem) return;

        // Skip DB update if the canvas layout hasn't changed
        const currentHash = getCanvasHash(nodes, edges);
        const { lastSavedHash, setLastSavedHash } = useAppStore.getState();

        if (currentDesignId && currentHash === lastSavedHash) {
            console.log('ℹ️ Canvas unchanged since last save. Skipping API request.');
            return;
        }

        setIsSaving(true);
        try {
            if (currentDesignId) {
                // Update
                const updated = await designsApi.updateDesign(currentDesignId, {
                    name: currentDesignName || undefined,
                    nodes: nodes as any,
                    edges: edges as any,
                });
                setCurrentDesign(updated.id, updated.name);
                setLastSavedHash(currentHash);
            } else {
                // Open Save As modal if no design exists yet
                const attemptsCount = problemDesigns.length;
                setSaveAsName(`Attempt ${attemptsCount + 1}`);
                setOverwritingDesignId(null);
                setSaveAsModalOpen(true);
            }
        } catch (error) {
            console.error('Save failed', error);
            alert('Failed to save design');
        } finally {
            setIsSaving(false);
        }
    };

    const confirmSaveAs = async () => {
        if (!currentProblem || !saveAsName.trim()) return;
        setSaveAsModalOpen(false);

        setIsSaving(true);
        try {
            if (overwritingDesignId) {
                // Overwrite existing design
                const updated = await designsApi.updateDesign(overwritingDesignId, {
                    name: saveAsName.trim(),
                    nodes: nodes as any,
                    edges: edges as any,
                });
                setCurrentDesign(updated.id, updated.name);
                useAppStore.getState().setLastSavedHash(getCanvasHash(nodes, edges));
                console.log('✅ Overwrote existing attempt:', updated.name);
            } else {
                // Save as a new design attempt
                const saved = await designsApi.saveDesign({
                    problemId: currentProblem.id,
                    name: saveAsName.trim(),
                    nodes: nodes as any,
                    edges: edges as any,
                });
                setCurrentDesign(saved.id, saved.name);
                useAppStore.getState().setLastSavedHash(getCanvasHash(nodes, edges));
                // Update URL to reflect the new design ID
                navigate(`/workspace/${currentProblem.id}?designId=${saved.id}`, { replace: true });
                console.log('✅ Saved new design attempt:', saved.name);
            }
            loadProblemDesigns();
        } catch (error) {
            console.error('Save As failed', error);
            alert('Failed to save design');
        } finally {
            setIsSaving(false);
            setOverwritingDesignId(null);
        }
    };

    const handleSaveAsNameChange = (val: string) => {
        setSaveAsName(val);
        const match = problemDesigns.find(d => d.name.toLowerCase() === val.trim().toLowerCase());
        if (match) {
            setOverwritingDesignId(match.id);
        } else {
            setOverwritingDesignId(null);
        }
    };

    const handleSwitchDesign = (designId: string) => {
        setIsDropdownOpen(false);
        if (currentProblem) {
            navigate(`/workspace/${currentProblem.id}?designId=${designId}`);
        }
    };

    useEffect(() => {
        if (mode === 'practice' && durationParam) {
            const initialTime = parseInt(durationParam) * 60; // minutes to seconds
            setTimeLeft(initialTime);
            hasTriggeredEvaluation.current = false;

            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev === null || prev <= 0) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [mode, durationParam]);

    useEffect(() => {
        if (mode === 'practice' && timeLeft === 0 && !hasTriggeredEvaluation.current) {
            hasTriggeredEvaluation.current = true;
            setTimeout(() => {
                alert("⏰ Time is up! Submitting your system design for AI evaluation.");
                document.dispatchEvent(new CustomEvent('trigger-evaluation'));
            }, 100);
        }
    }, [timeLeft, mode]);

    const handleExport = useCallback(() => {
        const flowElement = document.querySelector('.react-flow') as HTMLElement;
        if (!flowElement) return;

        setIsExporting(true);
        toPng(flowElement, {
            filter: (node) => {
                // Exclude minimap and controls from export
                if (
                    node?.classList?.contains('react-flow__minimap') ||
                    node?.classList?.contains('react-flow__controls')
                ) {
                    return false;
                }
                return true;
            },
            backgroundColor: 'rgb(var(--color-bg-tertiary))', // Match canvas background
            pixelRatio: 2, // High resolution scaling
        })
            .then((dataUrl) => {
                const a = document.createElement('a');
                a.setAttribute('download', `${currentDesignName || 'architecture'}.png`);
                a.setAttribute('href', dataUrl);
                a.click();
            })
            .catch((err) => {
                console.error('Failed to export image', err);
                alert('Failed to export design as image.');
            })
            .finally(() => {
                setIsExporting(false);
            });
    }, [currentDesignName]);

    const handleExportJSON = () => {
        if (nodes.length === 0) return;
        const blueprint = {
            problemId: currentProblem?.id,
            problemTitle: currentProblem?.title,
            name: currentDesignName || 'Blueprint',
            nodes,
            edges,
            feedback: useAppStore.getState().feedback,
            exportedAt: new Date().toISOString()
        };

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(blueprint, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `${currentDesignName || 'blueprint'}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    };

    const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target?.result as string);
                if (parsed && Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
                    if (window.confirm("Are you sure you want to import this blueprint? It will replace your current canvas progress.")) {
                        setNodes(parsed.nodes);
                        setEdges(parsed.edges);
                        if (parsed.feedback) {
                            useAppStore.getState().setFeedback(parsed.feedback);
                        } else {
                            useAppStore.getState().setFeedback(null);
                        }
                        console.log('✅ Loaded imported JSON architecture blueprint');
                    }
                } else {
                    alert("Invalid blueprint file format. Must contain 'nodes' and 'edges' arrays.");
                }
            } catch (err) {
                alert("Failed to parse blueprint JSON file.");
            }
        };
        reader.readAsText(file);
        e.target.value = ''; // Clear value
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getTimerColor = (seconds: number) => {
        if (seconds < 300) return 'text-red-500 animate-pulse'; // Less than 5 mins
        if (seconds < 900) return 'text-amber-500'; // Less than 15 mins
        return 'text-[rgb(var(--color-primary))]';
    };

    return (
        <div className="h-14 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] flex items-center justify-between px-4 shrink-0 z-20 shadow-sm">
            {/* Hidden Input for JSON Import */}
            <input 
                type="file" 
                ref={fileInputRef} 
                accept=".json" 
                onChange={handleImportJSON} 
                className="hidden" 
            />

            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/problems')}
                    className="flex items-center gap-2 text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="font-medium">Back to Problems</span>
                </Button>

                <div className="h-6 w-px bg-[rgb(var(--color-border))]" />

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]">
                        <Home className="w-4 h-4" />
                    </div>
                    <div>
                        <h1 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] leading-tight flex items-center gap-2">
                            {currentProblem ? currentProblem.title : 'System Design Workspace'}

                            {currentProblem && (
                                <div className="relative">
                                    <button
                                        className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))]/20 transition-colors"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    >
                                        <span className="max-w-[150px] truncate">{currentDesignName || 'Latest Attempt'}</span>
                                        <ChevronDown className="w-3 h-3" />
                                    </button>

                                    {isDropdownOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                                            <div className="absolute top-full left-0 mt-1 w-48 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg shadow-xl z-50 overflow-hidden">
                                                <div className="py-1 max-h-48 overflow-y-auto">
                                                    {problemDesigns.length === 0 ? (
                                                        <div className="px-3 py-2 text-xs text-[rgb(var(--color-text-secondary))]">No saved designs</div>
                                                    ) : (
                                                        problemDesigns.map(d => (
                                                            <button
                                                                key={d.id}
                                                                className="w-full text-left px-3 py-2 text-sm hover:bg-[rgb(var(--color-bg-secondary))] flex items-center justify-between text-[rgb(var(--color-text-primary))]"
                                                                onClick={() => handleSwitchDesign(d.id)}
                                                            >
                                                                <span className="truncate">{d.name || 'Unnamed Design'}</span>
                                                                {d.id === currentDesignId && <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </h1>
                        {currentProblem && (
                            <div className="flex items-center gap-2">
                                <p className="text-[10px] text-[rgb(var(--color-text-tertiary))] font-medium uppercase tracking-wider">
                                    {currentProblem.difficulty} Difficulty
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Center - Practice Timer */}
            {mode === 'practice' && timeLeft !== null && (
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] shadow-sm">
                    <Timer className={`w-4 h-4 ${getTimerColor(timeLeft)}`} />
                    <span className={`text-sm font-bold font-mono ${getTimerColor(timeLeft)}`}>
                        {formatTime(timeLeft)}
                    </span>
                    <span className="text-xs text-[rgb(var(--color-text-tertiary))] font-medium uppercase tracking-wider ml-1">
                        Remaining
                    </span>
                </div>
            )}

            {/* Right side - Actions & Profile */}
            <div className="flex items-center gap-2">
                <div className="flex items-center mr-2 bg-[rgb(var(--color-bg-secondary))] rounded-lg p-1 border border-[rgb(var(--color-border))]">
                    {currentProblem && (
                        (currentProblem.title.toLowerCase().includes('url shortener') ||
                         currentProblem.title.toLowerCase().includes('tinyurl'))
                    ) && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs font-semibold text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 gap-1.5 tooltip-trigger"
                                onClick={handleLoadExample}
                                title="Load an example reference design solution"
                            >
                                <BookOpen className="w-3.5 h-3.5" />
                                Load Example
                            </Button>
                            <div className="w-[1px] h-4 bg-[rgb(var(--color-border))] mx-1" />
                        </>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs font-medium text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))]/10 gap-1.5"
                        onClick={handleSave}
                        disabled={isSaving || nodes.length === 0}
                    >
                        {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        {currentDesignId ? 'Save' : 'Save New'}
                    </Button>
                    <div className="w-[1px] h-4 bg-[rgb(var(--color-border))] mx-1" />
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs font-medium text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))]/10 gap-1.5 tooltip-trigger"
                        onClick={() => {
                            const attemptsCount = problemDesigns.length;
                            setSaveAsName(currentDesignName ? `${currentDesignName} (Copy)` : `Attempt ${attemptsCount + 1}`);
                            setOverwritingDesignId(null);
                            setSaveAsModalOpen(true);
                        }}
                        disabled={isSaving || nodes.length === 0}
                        title="Save as a new attempt"
                    >
                        <Copy className="w-3.5 h-3.5" />
                        Save As...
                    </Button>
                    <div className="w-[1px] h-4 bg-[rgb(var(--color-border))] mx-1" />
                    
                    {/* Blueprint dropdown containing Export/Import */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs font-medium text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))]/10 gap-1.5"
                            onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                            title="Export or Import blueprints"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Blueprint
                            <ChevronDown className="w-3 h-3" />
                        </Button>

                        {isExportDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsExportDropdownOpen(false)} />
                                <div className="absolute right-0 top-full mt-1 w-48 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg shadow-xl z-50 overflow-hidden">
                                    <div className="py-1">
                                        <button
                                            className="w-full text-left px-3 py-2 text-xs hover:bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-primary))] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => { setIsExportDropdownOpen(false); handleExport(); }}
                                            disabled={isExporting || nodes.length === 0}
                                        >
                                            {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5 text-indigo-500" />}
                                            Export as PNG Image
                                        </button>
                                        <button
                                            className="w-full text-left px-3 py-2 text-xs hover:bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-primary))] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => { setIsExportDropdownOpen(false); handleExportJSON(); }}
                                            disabled={nodes.length === 0}
                                        >
                                            <FileText className="w-3.5 h-3.5 text-amber-500" />
                                            Export JSON Blueprint
                                        </button>
                                        <div className="h-[1px] bg-[rgb(var(--color-border))] my-1" />
                                        <button
                                            className="w-full text-left px-3 py-2 text-xs hover:bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-primary))] flex items-center gap-2"
                                            onClick={() => { setIsExportDropdownOpen(false); fileInputRef.current?.click(); }}
                                        >
                                            <Upload className="w-3.5 h-3.5 text-emerald-500" />
                                            Import JSON Blueprint
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <Button variant="ghost" size="icon" className="text-[rgb(var(--color-text-secondary))]" onClick={() => navigate('/settings')} title="Settings">
                    <Settings className="w-4 h-4" />
                </Button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-primary-hover))] flex items-center justify-center text-white text-xs font-bold shadow-md">
                    <User className="w-4 h-4" />
                </div>
            </div>

            {/* Save As Modal */}
            {saveAsModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-5 py-4 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-secondary))]/30">
                            <h2 className="text-md font-semibold text-[rgb(var(--color-text-primary))]">Save Design Version</h2>
                            <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-0.5">
                                Clone as a new version or overwrite an existing attempt.
                            </p>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-[rgb(var(--color-text-secondary))]">
                                    Attempt Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-lg px-3 py-2 text-sm text-[rgb(var(--color-text-primary))] placeholder-[rgb(var(--color-text-tertiary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]/50 focus:border-[rgb(var(--color-primary))]/50 transition-all"
                                    placeholder="e.g., Sharded Database Version"
                                    value={saveAsName}
                                    onChange={(e) => handleSaveAsNameChange(e.target.value)}
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') confirmSaveAs();
                                        if (e.key === 'Escape') setSaveAsModalOpen(false);
                                    }}
                                />
                            </div>

                            {problemDesigns.length > 0 && (
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[rgb(var(--color-text-secondary))]">
                                        Select Existing Attempt to Overwrite
                                    </label>
                                    <div className="border border-[rgb(var(--color-border))] rounded-lg max-h-28 overflow-y-auto divide-y divide-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-secondary))]/30">
                                        {problemDesigns.map((design) => (
                                            <button
                                                key={design.id}
                                                type="button"
                                                onClick={() => {
                                                    setSaveAsName(design.name);
                                                    setOverwritingDesignId(design.id);
                                                }}
                                                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors hover:bg-[rgb(var(--color-bg-secondary))] ${
                                                    overwritingDesignId === design.id 
                                                    ? 'bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] font-semibold' 
                                                    : 'text-[rgb(var(--color-text-secondary))]'
                                                }`}
                                            >
                                                <span className="truncate">{design.name || 'Unnamed Attempt'}</span>
                                                <span className="text-[9px] text-[rgb(var(--color-text-tertiary))] font-mono shrink-0 ml-2">
                                                    {design.feedback ? `${design.feedback.score} pts` : 'No score'}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="px-5 py-3.5 bg-[rgb(var(--color-bg-secondary))]/50 flex items-center justify-end gap-2 border-t border-[rgb(var(--color-border))]">
                            <Button variant="ghost" onClick={() => setSaveAsModalOpen(false)} className="py-1 px-3 text-xs">
                                Cancel
                            </Button>
                            <Button onClick={confirmSaveAs} disabled={!saveAsName.trim()} className="py-1 px-3 text-xs">
                                {overwritingDesignId ? 'Overwrite Attempt' : 'Save Version'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
